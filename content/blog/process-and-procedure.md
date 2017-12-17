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

Thanks to tail-call optimization, recursive procedures are easy to re-implement as iterative
processes in Scheme. Since `add` was a toy example, let's take on a more
challenging algorithm: Pascal's triangle.

Pascal's triangle&mdash;also known as the binomial coefficients&mdash;
is a classic recursive algorithm:
to find any given element in the triangle, sum the two elements that precede it. Keep
going until you reach the first element, which is 1.

```
    1
   1 1
  1 2 1
 1 3 3 1
1 4 6 4 1
```
<p><em>Pascal's triangle, computed up to </em>`n = 5`.</p>

Writing a recursive procedure that generates
a recursive process to calculate elements in Pascal's triangle is relatively
simple. There are four key insights:

1. Every element in the triangle has a row position (`row`)
and a column position (`col`)
2. The value of any given element in the triangle can be computed by summing
   together the elements in the preceding row that have column positions `col - 1` and `col`
3. Elements at the edge and peak of the triangle, where `row = col`, always have a value
   of 1 (the base case of the algorithm)
4. All elements with row/column positions that would seem to lie "outside" the
   triangle can be treated as if they have the value 0

Based on these insights, we can write a procedure that uses a recursive process
to calculate the value for any given `row, col` position:

```scheme
(define (pascal row col)
  ;;; Calculate a value in Pascal's triangle for a given row and col
  (cond ((= row col) 1)  ; Edges of the triangle
        ((or (< col 1) (> col row)) 0)  ; Ignore values beyond triangle bounds
        (else (+ (pascal (- row 1) (- col 1))  ; Preceding value on the left
                 (pascal (- row 1) col)))))    ; Preceding value on the right
```

Then, we can use this procedure to calculate the coefficients for any given row
by iterating over the column positions in that row:

```scheme
(define (binom-coef n)
  ;;; Display the binomial coefficients for `n`
  (define (pascal-row row col)
      (if (= row col)
          (write-to-string (pascal row col))
          (string-append (write-to-string (pascal row col))
                          " "
                          (pascal-row row (+ col 1)))))
  (pascal-row n 1))
```

A similar logic applies for the triangle itself, which we can build from the
ground up.

```scheme
(define (build-triangle n count)
  (if (= count n)
      (binom-coef count)
      (string-append (binom-coef count)
                     "\n"
                     (build-triangle n (+ count 1)))))
```

Putting it all together:

```scheme
(define (pascals-triangle n)
  (display (build-triangle n 1)))

(pascals-triangle 5)
1
1 1
1 2 1
1 3 3 1
1 4 6 4 1
```

There are two reasons that this solution is inefficient:

1. The procedure that computes the value for any given position, `pascal`,
   spawns a recursive process

2. Since `pascal` recurses the entire triangle every time it computes a value,
   the procedure winds up doing a bunch of redundant work

What if we used an iterative process to improve on both of these weaknesses? 

## Iterative Pascal

Following a similar logic as `add_iter`, designing
a recursive procedure that spawns an iterative process to generate Pascal's
triangle is a snap. Instead of recursing back down the entire triangle to
compute any given value, an iterative process should instead start at the
base of the triangle and work its way up.

```scheme
(define (pascal-iter n)
  ;;; Compute and display Pascal's triangle up to row `n` -- iteratively!
  (define (list-to-string str lst)
    (cond ((null? lst) str)
          ((string=? str "") (list-to-string (string (car lst)) (cdr lst)))
          (else (list-to-string (string-append str " " (string (car lst))) (cdr lst)))))
  (define (next-row curr-coefs row)
    (cond ((null? (cdr row)) ; End of the list: make sure to append last elem
             (append curr-coefs (list (car row))))
          ((null? curr-coefs) ; Start of the list: make sure to append first elem
             (next-row (list (car row)) row))
          (else
             (next-row (append curr-coefs (list (+ (car row) (cadr row))))
                       (cdr row)))))
  (define (build-triangle str lst n count)
    (let ((next-str (string-append str "\n" (list-to-string "" (next-row (list) lst)))))
      (if (= count n)
          next-str
          (build-triangle next-str (next-row (list) lst) n (+ count 1)))))
  (let ((init-value (list 0 1 0)))
    (display (build-triangle (list-to-string "" init-value) init-value n 1))))

(pascal-iter 5)
1
1 1
1 2 1
1 3 3 1
1 4 6 4 1
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
