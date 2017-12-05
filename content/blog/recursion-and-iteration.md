title: Process and Procedure 
summary: As Scheme knows, procedures and processes are very different beasts. Tail recursion makes this distinction clear.
date: 2017-12-01
category: code
tags: recursion and iteration; lisp; scheme; abstraction and implementation
published: false


One of the most enlightening parts of learning a Lisp (in my case, the lovely
research dialect [Scheme](https://groups.csail.mit.edu/mac/projects/scheme/))
has been the way that the Lisp family, and Scheme in particular, treats
recursion. Studying recursion in Lisp has helped me develop a richer understanding
of the distinction between process and procedure.

Growing up on Python, I was always taught that "recursion" described functions
that called themselves. For a quick example:

```python
<recursive function>
```

Like many of the ideas I picked up while learning to program computers, this is
almost true: the function (also known as the "procedure") is indeed recursive.
But the _process_ that the function generates, the set of instructions that a machine will
follow on execution, is not necessarily so. This is a distinction with a lot of difference,
and it has little to do with whether or not the function "calls itself."

In Python, it turns out that both this function and the process it spawns will be recursive:
that's just the way that the runtime works. But since
Scheme is [tail-recursive](https://en.wikipedia.org/wiki/Tail_call), we can
note an important difference in the way that the machine will follow
our instructions. Here's an equivalent procedure in Scheme:

```scheme
<recursive procedure>
```

Stepping through the execution of the procedure reveals that its process
maintains the same "shape" throughout: three arguments, each changing slightly,
and an operator. 

```scheme
<iterative execution>
```
Effectively, this is very similar behavior to a for-loop,
where a counter diminishes as a state variable gets updated. Like for-loops,
this process is _iterative_: rather than expanding on itself until it reaches
and endpoint, it simply steps through a counter until the counter is exhausted.
As a bonus, Scheme's tail-recursion means that we can toss the stack frame after each call,
so we don't have to keep any data in memory other than the current values of
the state variable at any given point in time. Nice! 

For contrast, here's an implementation of the function that is recursive at the
level of both process _and_ procedure: 

```scheme
<recursive procedure>

;; Execution 
<recursive execution>
```

Note that the "shape" of the process, including the number of arguments and
operations that it has to remember, expands linearly with each step. This matches
more closely to the notion of recursion in mathematics, in which a rule
declares a terminal value and a sequence for generating successive values.
Pascal's triangle (also known as the binomial coefficients) is a nice example
of recursion: 
to find any given element in the triangle, sum the two elements that precede it; keep
going until you reach the first element, which is 1.

[Illustration of pascal's triangle]()

Since Scheme encourages recursion, writing a recursive procedure that generates
a recursive process to calculate elements in Pascal's triangle is easy. It
"feels" very similar to the mathematical definition of the binomial
coefficients:

```
<math>
```

```scheme
<pascal's triangle>
```

Following a similar logic as <procedure>, however, we can easily design
a recursive procedure that spawns an _iterative_ process! All we need is to
keep track of the state variables and generate a tail call.

```scheme
<pascal's iterative triangle>
```

At small scales, the distinction between recursive and iterative processes
doesn't make much of a difference. I usually care more about whether the procedure is 
written in a way that will make its ideas clear to the people who have to work with it.
But as the size of the input grows without
bound, the nature of the process becomes much more important: does the machine
have to store an argument and an operator for every step of the procedure, or
can it get away with only storing three arguments and an operator?

As a functional language, Scheme encourages recursion and makes it intuitive.
This is a lot of responsibility, and it can lead to code that doesn't scale. But
it's helpful for understanding the difference between process and procedure, and
it helps me write more intentional code.

_For more on recursive and iterative processes, I recommend chapter 1.2 in Abelson,
Sussman, and Sussman's [_Structure and Interpretation of Computer
Programs_](https://mitpress.mit.edu/sicp/full-text/book/book.html), from which
much of this post was cribbed_
