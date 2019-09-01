title: A Functional API For Neural Nets in PyTorch
summary: What would PyTorch look like if state was properly encapsulated?
date: 2018-07-18
category: code
slug: pytorch-api
tags: python; pytorch; ml; ai
published: false


The encapsulation of model state in PyTorch is, to be frank, confusing. The API for
defining a module container is pleasantly functional (as in functional programming),
but to train the model, suddenly the user is required to share its parameters and
its gradient among multiple disconnected objects, including an optimization algorithm
and a loss function. These objects are in turn called upon to mutate the parameters
in specific, unintuitive ways, such as through the `loss.backward()` and `optimizer.step()` methods.

What's going on with state in PyTorch? Why are model parameters shared and mutated between
three distinct objects? And what would PyTorch look like with an API that was
more clearly inspired by functional programming?

## Background: PyTorch and parameter state

To see how parameter state is currently handled in PyTorch, let's take a simple module
container as an example. We'll initialize the container with 128 input nodes,
a hidden layer with 64 nodes and ReLU activation, and an output layer with
10 nodes and log-softmax activation:

```python
import torch

model = torch.nn.Sequential(
    torch.nn.Linear(128, 64),
    torch.nn.ReLU(),
    torch.nn.Linear(64, 10),
    torch.nn.LogSoftmax()
)
```

So far, this API is nicely functional. We define the network's layers declaratively,
mirroring an interpretation of the network as a composition of linear transformations.
No classes, and no state to deal with.

Things get weird when it comes time to train the network. To perform training,
PyTorch requires us to initialize an optimizer -- that is, an optimization algorithm,
such as stochastic gradient descent (SGD). Suddenly, we need to share the model's
parameter state with the optimizer object in order to initialize it:

```python
# Initialize an optimizer using stochastic gradient descent
optimizer = torch.optim.SGD(model.parameters(), lr=0.01)
```

PyTorch also requires us to initialize a second object, a criterion (or loss
function) to calculate the gradient of the network. This object is entirely
decoupled from the module container `model`:

```python
# Initialize a loss function using negative log-likelihood loss
criterion = torch.nn.NLLLoss()
```

When training the model, these three objects -- the module container, the optimizer,
and the criterion -- all come together to mutate the same state, the model's
parameters and gradient. Here's what a simple training loop might look like:

```python
for epoch in range(epochs):
    for feature, label in training_data:
        # Clear out the gradient
        optimizer.zero_grad()

        # Forward pass through the network
        output = model(feature)

        # Calculate the loss
        loss = criterion(output, label)

        # Compute the gradient
        loss.backward()

        # Update the weights
        optimizer.step()
```

Let's take these steps one-by-one and try to figure out how the parameter state
is shared between the three objects.

### 1. Zero out the gradient

In PyTorch, optimizers know nothing about the training loop, so they will continue
to accumulate gradients indefinitely unless instructed to stop. Hence, to initiate a
new forward and backward pass, we need to start by clearing out any gradients that
may have previously been calculated:

```python
optimizer.zero_grad()
```

This method raises some confusing questions. Why should the optimizer own this
method, instead of the module container `model` (which initialized the weights)?
Why is the optimizer responsible for storing the gradient, and not the `model`?
The situation will become even more  confusing later on, when we start to see
how the gradient is calculated.

### 2. Foward pass through the network

The forward pass is straightfowrad. We can treat our module container `model` as
a function and use it to generate the output of the network:

```python
output = model(feature)
```

No funny business here, just input and output.

### 3. Calculate the loss

Calculating the loss is also relatively straightforward. We can treat our `NLLLoss`
criterion as a function and apply it to the output and the labels to calculate
the loss:

```python
loss = criterion(output, label)
```

### 4. Compute the gradient

Here, things get particularly weird. The _loss function output_ computes the
gradient across the network's layers:

```python
loss.backward()
```

From a mathematical perspective, it makes some sense that the loss function owns the
`backward()` method: after all, the gradient represents the partial derivative of the loss
function with respect to the network's weights. Yet by assigning `backward()` to
the loss function output, PyTorch is obscuring the fact that it is using the
layers contained by `model` to propagate the gradient backward through the network --
layers which have been passed through to `output` by the criterion, in order to
calculate the gradient in `loss.backward()`. Instead of making this shared state clear,
the API obscures it.

### 5. Update the weights

With the gradient in hand, it's time to update the weights by taking a small
step in the direction of the negative gradient. Which of our objects should be responsible
for this step? You might guess the module container `model`, which stores the
parameter state, but instead this duty falls on the optimizer:

```python
optimizer.step()
```

Defining `step()` as an optimizer method with no inputs or outputs obfuscates the
stakes of the operation. What was the shape of the gradient? How large were the
weights that it updated? There's no way to know without inspecting the `optimizer` object,
which has further obscured the underlying parameter state.

### In sum: A lack of clear ownership of state

The full PyTorch training pass reveals that none of the required objects has full
ownership of the model's weights or gradient. Instead, `model`, `loss`, and
`optimizer` all mutate the parameter state in different ways.

Why might PyTorch have designed its API such that all three objects -- the
module container, the loss function, and the optimization algorithm -- mutate the
same model parameter state? Are there benefits to this approach, or is it simply
bad API design?

## The benefits of a composable API

One advantage to spreading ownership of state between the model, loss function,
and optimizer is that it makes PyTorch more _composable_,
and hence in some sense more flexible. In PyTorch, loss functions and optimization
algorithms aren't tightly coupled to neural networks, since the three types of
objects are fully separate from one another. Because of this, PyTorch can be used to
optimize _any_ function, not just a neural network. Take `x**2` as an example:

```python
def f(x): return x**2

x = torch.Tensor([[1, 2, 3]])
output = f(x)
# TODO: Compute the gradient of the feature
```

This composability is nice, but it comes at a cost of clarity for working
with neural networks -- supposedly the primary purpose of PyTorch.

## Clearing up the API for neural nets

One easy way to improve the API for neural nets would be to encapsulate all mutation
of the weights in the module container object `model`. We could accomplish this
by requiring the module container to be explicitly initialized with a loss function and
an optimization algorithm:

```python
# Initialize the model as before, but specify a loss function and optimizer
model = torch.nn.Sequential(
    torch.nn.Linear(128, 64),
    torch.nn.ReLU(),
    torch.nn.Linear(64, 10),
    torch.nn.LogSoftmax(),
    loss=torch.nn.NLLLoss(),
    optimizer=torch.optim.Adam(lr=0.01)
)
```

Then, the training loop would make it clear that the module container was in
charge of updating the weights:

```python
for epoch in range(epochs):
    for feature, label in training_data:
        # Compute the gradient and propagate it backward
        model.step(feature, label)
```

Notice how `model` now owns all of the state update methods: zeroing out
the gradient with `zero_grad()` and taking the weight update step with `step()`
both belong to the module container `model`. Implicitly, the `step()` function
could use the module's loss function and optimizer to calculate the gradient
and update the weights -- something along the lines of the following pseudocode:

```python
class Module:
    def step(self, feature, label):
        self.zero_grad()
        output = self.forward(feature)
        loss = self.loss(output, label)
        loss.backward()
        self.optimizer.step()
```

With this API, the weights and their respective gradients more clearly "belong"
to the network, not to its loss function or optimization algorithm.

In fact, this API winds up being much more similar to the one that scikit-learn uses
for neural networks. In scikit-learn, the entire training loop above is replaced
by the [`model.fit(X, y)` method](https://scikit-learn.org/stable/modules/generated/sklearn.neural_network.MLPClassifier.html#sklearn.neural_network.MLPClassifier.fit),
which takes care of looping over the training features `X` and labels `y`. In this
way, scikit-learn takes the abstraction one layer higher and encapsulates _all_
training state in the `model` object, including the training epochs.

And yet, by encapsulating state in the module container `model`, the API
still suffers from a lack of clarity in terms of how `zero_grad()`, `backward()`, and `step()`
are adjusting the module container's internal parameter state. In order to inspect
the gradient, for example, the user would need to drop some form of debugger and
introspect the internal state of `model`. Is there a way to make this state even clearer?

## Functional programming with PyTorch

One way to provide clearer state would be to make the module container methods
more functional by returning output instead of producing side effects:

```python
# Create a module container as before, by specifying the network's linear operations,
# but assume that it returns a factory function instead of a model
ModelFactory = torch.nn.Sequential(
    torch.nn.Linear(128, 64),
    torch.nn.ReLU(),
    torch.nn.Linear(64, 10),
    torch.nn.LogSoftmax()
)

# Initialize the model with empty parameters
# (assume that Parameters() initializes empty weights)
model = ModelFactory(torch.nn.Parameters())

# Initialize a loss function
criterion = torch.nn.NLLLoss()

for epoch in range(epochs):
    for feature, label in training_data:
        # Forward pass through the network
        output = model(feature)

        # Calculate the loss
        loss = criterion(output, label)

        # Compute the gradient
        gradient = model.backward(loss)

        # Update the weights
        parameters = model.step(gradient)

        # Initilize a new model with the weights
        model = ModelFactory(parameters)
```

The training pass is now more verbose, but as as a result, its output is
inspectable at every step, and no state is shared between objects. Each step in
the training loop -- forward pass, calculating loss, computing gradients, and
updating the weights -- produces immutable output that can be passed into the
next step.

There are a few critical differences with this API:

- `torch.nn.Sequential` must be a _factory function_ instead of a straightforward
  constructor. It produces functions (like `Model`) that will themselves produce
  module containers when initialized with a set of parameters.

- `torch.nn.Parameter` must be adjusted slightly such that it can automatically represent
  empty weights when passed into a module container constructor function.

- Parameters can now be made immutable. Instead of updating weights in-place,
  the `step()` method produces a _new_ set of weights based on the gradient.

- The module container `model` must now own the `backward()` and `step()` methods,
  in order to produce the gradient and the updated parameters, respectively. This makes
  intuitive sense, since the gradient and the updated weights depend on the
  existing weights, which are fully encapsulated in the module container `model`.

In all, I think this API makes more sense than the current API for feedforward
networks. Inspired by functional programming, it makes the ownership of state
in the network more transparent; it converts the module parameters to immutable
objects, making their transitions clearer and safer; and it provides transparent output
for every step of the training pass, making each operation both more flexible and
more open to inspection.

## A few caveats

There are some reasons that you might not prefer this more functional PyTorch API to
the one that currently exists.

For one thing, an API with fully immutable state would mean that memory would
need to be reallocated for the weights during every pass through the network.
Without careful garbage collection, this might cause an explosion in memory when
training very deep networks with large hidden layers.

Another important consideration is that I've only examined simple feedforward
networks here. It's possible that recurrent networks and networks with convolutional
layers have substantially different requirements such that this API would need
a major redesign to support them.

Finally, I'm still relatively new to PyTorch. There's a good chance that I'm
missing some basic motivations behind the design of the existing API. If you think
this is true, get in touch with me [on Twitter](https://twitter.com/jean_cochrane)!
I'd love to know what I'm missing.
