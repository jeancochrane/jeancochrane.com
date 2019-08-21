title: Against hyperparameter tuning
summary: Computers should have to figure out hyperparameters, not engineers. AutoML gets this right.
date: 2019-08-20
slug: against-hyperparameter-tuning
category: code
tags: ml; ai; hyperparameters;
published: true


The notion of a "hyperparameter" doesn't sit right with me. Ostensibly, a hyperparameter is an input to a neural network, often a constant (though not always, as with adaptive learning rates) -- an adjustable value that affects the way that the network learns but which is not directly _learnable_ through backpropagation. Hence traditional wisdom dictates that network designers should be in charge of "tuning" hyperparameters while the network itself should take responsibility for learning its weights.

Yet in practice, the task of tuning hyperparameters can feel less like design and more like performing an algorithmic search over the hyperparameter space. Take for example the network as designed for the first project in Udacity's Deep Learning Nanodegree, predicting bikeshare demand in Washington, D.C. using [a dataset curated by Hadi Fanaee Tork](http://archive.ics.uci.edu/ml/datasets/Bike+Sharing+Dataset) at the University of Porto. The project gives the student some instructions on how to tune the network's hyperparameters:

> Here [at this point in the code] you'll set the hyperparameters for the network. The strategy here is to find hyperparameters such that the error on the training set is low, but you're not overfitting to the data.

Already, the instructions suggest a "strategy" that isn't formally specified. What principled decisions should the student make in order to strike the right balance? The instructions provide three hyperparameters for this network: the number of epochs, the learning rate, and the size of the hidden layer. Yet there's little guidance for why these hyperparameters are the relevant ones, or how they should interact, beyond simple heuristics (such as "if the network has problems fitting the data, try reducing the learning rate").

Ultimately, the work of tuning these three parameters feels like grasping at a search algorithm to solve a system of linear equations in three dimensions. Tweak the number of iterations, see if test accuracy continues to improve, ratchet up the learning rate to increase the magnitude of the weight update, pick off a few hidden nodes to diminish the gap between the training and test accuracy... The recurring question becomes: Why should the network designer be hunting for a good combination of these three values? _Isn't it the job of the network to solve linear equations?_

The research field of [AutoML](https://en.wikipedia.org/wiki/Automated_machine_learning) is so exciting precisely because it seeks to tackle this contradiction. From the [neural architecture](https://en.wikipedia.org/wiki/Neural_architecture_search) to the [learning rate](https://en.wikipedia.org/wiki/Learning_rate#Adaptive_learning_rate), traditional neural network design is full of arbitrary decisions left up to the network designer. We should be doing everything we can to move this work from the network designer to the computer -- and we can certainly do a lot better than grid search.
