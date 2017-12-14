title: Process and Procedure 
summary: As Scheme knows, procedures and processes are very different beasts. Tail recursion makes this distinction clear.
date: 2017-12-01
category: code
tags: recursion and iteration; lisp; scheme; abstraction and implementation
published: true 


One of the most enlightening parts of learning a Lisp (in my case, the lovely
research dialect [Scheme](https://groups.csail.mit.edu/mac/projects/scheme/))
has been getting familiar with the way that functional languages like Scheme treat
recursion. Studying recursion in Scheme has helped me develop a richer understanding
of the distinction between **process and procedure**, two different ways of
imagining function execution that each help clarify how an interpreter thinks.

## Form and function

Growing up on Python, I was always taught that "recursion" described functions
that called themselves. Take a quick and classic example: a recursive function
for adding positive integers.

```python
def add(a, b):
    '''
    Sum positive integers `a` and `b`.
    '''
    if b == 0:
        return a
    else:
        b -= 1
        return (1 + (add(a, b)))
```

In all cases where `b != 0`, `add` will indeed call itself. In fact, since
the call to `add` will be the last instruction that the function executes, we
can more precisely say that `add` is _tail recursive_.

But there's a second, more subtle property that makes `add` recursive: 
its calls to itself will expand as it executes, and the _stack frame_, the queue that the Python
interpreter uses to monitor and execute function calls, will grow.
In other words, the interpreter will keep holding on to
progressively bigger versions of `(1 + (add(a, b)))` until it reaches the "base
case" where `b == 0`, when it can finally start to contract on itself and
perform the sequential additions that have been piling up. 

To see this expansion in practice, we can use Python's [built-in `inspect`
module](https://docs.python.org/3/library/inspect.html) to peek at the stack at
the moment the interpreter reaches the base case. 

```python
import inspect

def print_stack():
    '''
    Print the current stack frame in a function call.
    '''
    # Set a counter for pretty printing
    idx = 0
    for frame in inspect.stack():
        # Filter out the portion of the stack corresponding to the trace
        if frame.code_context and 'inspect' not in frame.code_context[0]:
            print(('\t' * idx) + frame.code_context[0].strip())
            idx += 1

def add(a, b):
    '''
    Sum positive integers `a` and `b`.
    '''
    if b == 0:
        # Before the execution starts contracting, print the stack
        print_stack()
        return a
    else:
        b -= 1
        return (1 + (add(a, b)))
```

Now the interpreter can print the stack of queued function calls, illustrating
the progressive expansion of `add`:

```
>>> add(1, 5)
return (1 + (add(a, b)))
    return (1 + (add(a, b)))
        return (1 + (add(a, b)))
            return (1 + (add(a, b)))
                return (1 + (add(a, b)))
6
```

As `add` moves deeper into its recursion, the function
calls pile up on one another. When it reaches the base case, the interpreter can
begin to evaluate the sequence of
nested expressions, which will look something like this:

```
(1 + (1 + (1 + (1 + (1 + (1))))))
```

This expansionary behavior is one reason that recursion can
be dangerous in production code. As `b` gets larger and larger, the interpreter will
have to hold all of the function calls in memory as it approaches the base
case. For very large inputs, this can cause memory to run out, or cause
the stack to overflow.

So from a practical perspective, there are in fact two important properties that
distinguish recursive functions, one largely formal and one largely functional:

1. The function has the capacity to call itself (form)
2. The function will expand on execution until it reaches a base case (function)

## Recursive procedure, iterative process

The two properties of recursive functions are handy heuristics, but there's
a twist: **they aren't guaranteed to go together**. Sometimes, the form of the
function&mdash;the way it's written for the human eye, or what I'll call its
"procedure"&mdash;doesn't intuitively match the way that a given interpreter
will execute it (that is, the "process," or machine instructions, that it spawns).

As an example, take a modified version of `add` that makes use of a slightly
different reflexive call:

```python
def add_iter(a, b):
    '''
    Sum positive integers `a` and `b`.
    '''
    if b == 0:
        return a
    else:
        return add_iter((a + 1), (b - 1))
```

In contrast to `add`, the modified `add_iter` appears to behave similarly to a
for-loop: the argument `a` stores the state as it increments, while the argument
`b` acts like a counter, progressively stepping towards 0. A state variable and
a counter&mdash;that's a decidedly
_iterative_ relationship! When `add_iter` executes, then, we might expect its
process to behave iteratively rather than recursively.

In Python, however, it turns out that `add_iter` executes recursively, in the exact same fashion
as `add`. Calling a traced version of `add_iter` reveals the expansion of the stack:

```
>>> add_iter(1, 5)
return add_iter((a + 1), (b - 1))
	return add_iter((a + 1), (b - 1))
		return add_iter((a + 1), (b - 1))
			return add_iter((a + 1), (b - 1))
				return add_iter((a + 1), (b - 1))
```

The interpreter doesn't really need the outer frames to keep track of where
`add_iter` is: as in a for-loop, the state variable `a` and the
counter `b` do a fine job of keeping time all on their own. But Python holds
onto them anyway, producing a recursive process where an iterative one would
have made more sense.

## Out with the stack: tail-call optimization in Scheme

Unlike Python, Scheme doesn't hang on to the outer frames of the stack when it
executes a tail-recursive function. Instead, Scheme is _tail-call optimized_: it
figures out when it can afford to toss unnecessary stack frames in
tail-recursive functions. Because tail
calls are optimized in Scheme, the interpreter can execute iterative processes
from recursive procedures.

Take an equivalent procedure to `add_iter`, implemented in Scheme:

```scheme
(define (add-iter a b)
  ;; Sum `a` and `b`.
  (if (= b 0)
      a
      (add-iter (+ a 1) (- b 1))))
```

Stepping through the execution of the procedure reveals that its process
maintains the same "shape" throughout: three arguments, each changing slightly,
and an operator. 

```
(add 1 5)
(add 2 4)
(add 3 3)
(add 4 2)
(add 5 1)
(add 6 0)
6
```

With optimized tail calls, the Scheme interpreter doesn't have to keep any extra
data in memory other than the current values of
the state variable and the counter at any given point in time during the
function execution. Nice and clean iteration, in the form of a recursive
procedure. 

## Fun with recursion and iteration in Scheme

In Scheme, recursive procedures are easy to re-implement as iterative
processes.

Pascal's triangle (also known as the binomial coefficients) is a fun example.
It's a classic recursive algorithm:
to find any given element in the triangle, sum the two elements that precede it. Keep
going until you reach the first element, which is 1.

[Illustration of pascal's triangle]()

Writing a recursive procedure that generates
a recursive process to calculate elements in Pascal's triangle is easy. It
"feels" very similar to the mathematical definition of the binomial
coefficients:

```
<math>
```

```scheme
<pascal's triangle>
```

Following a similar logic as `add_iter`, however, we can easily design
a recursive procedure that spawns an _iterative_ process to generate Pascal's
triangle. All we need to do is to
keep track of the state variables and generate a tail call.

```scheme
<pascal's iterative triangle>
```

## Conclusion

At small scales, the distinction between recursive and iterative processes
doesn't make much of a difference. I usually care more about whether a procedure is 
written in a way that will make its ideas clear to the people who have to work with it.
But as the size of the input grows without
bound, the nature of the process that a procedure spawns becomes much more important: does the machine
have to store ever-expanding function calls for every step of the procedure, or
can it get away with only storing three arguments and an operator?

As a functional, tail-call optimized language, Scheme encourages a sublter kind
of recursion than Python. Recursive procedures in Scheme can spawn processes that are
either iterative or recursive, depending on the context, allowing the
programmer
finer-grained control over the machine execution&mdash;if they know what
they're doing.

-----

_For more on recursive and iterative processes, I recommend chapter 1.2 in Abelson,
Sussman, and Sussman's [_Structure and Interpretation of Computer
Programs_](https://mitpress.mit.edu/sicp/full-text/book/book.html), from which
much of this post was cribbed._
