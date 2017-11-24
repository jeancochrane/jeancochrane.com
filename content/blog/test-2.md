title: Testing syntax highlighting 
summary: Highlighting courtesy of Pygments. 
date: 2017-11-09
tags: rock, pop, jazz
published: true

## Testing syntax highlighting

Here are some code blocks:

### Python

```python
def test_highlighting(code_block):
    for block in code_block:
        if block:
            print('%s' % block)

    return code_block
```

### SQL

```sql
SELECT
  good.name,
  good.id
FROM good_blocks AS good 
UNION
SELECT
  bad.name,
  bad.id
FROM bad_blocks AS bad
```

### Javascript

```javascript
var codeBlocks = ['python', 'sql', 'javascript'];

function printBlocks(blocks) {
    for (var i=0; i<blocks.length; i++) {
        console.log(blocks[i]);
    }
}

printBlocks(codeBlocks);
```

### Scheme

```scheme
(define (pascal row col)
  ;;; Calculate a value in Pascal's triangle for a given row and col
  (cond ((or (= col 1) (= row col)) 1)
        ((or (< col 1) (> col row)) 0)
        (else (+ (pascal (- row 1) (- col 1))
                 (pascal (- row 1) col)))))
```
