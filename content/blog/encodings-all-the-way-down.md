title: It's Encodings All the Way Down 
summary: Encodings define representational systems for communicating abstractions. That's why they let you do magical things, like use a haiku or a T-Shirt to rip DVDs.
date: 2017-11-26
slug: encodings-all-the-way-down
category: code
tags: abstraction and implementation; encodings; symbols 
published: true


Encodings are confusing. But they're also magical. Pretty much everything that
a computer does involves encodings. Also, a lot of what we do as humans to
communicate with each other involves encodings, too.

[DVD ripping case]

Another case in point: number bases. I've struggled with number bases for as long as
I can remember. Binary and hexadecimal in particular have always
vexxed me, and I've relied on all sorts of kludges like color wheels to allow myself to work with
them without really understanding what they _do_. 

This month, however, I had a breakthrough. I was working on some legacy
code that scraped rows from Google Sheets documents
using Python and Google's old
[API client](https://github.com/google/google-api-python-client). The sheet 
schema had changed, and we needed to update the import script to make
sure we were pulling attributes from the right cells.

When the Google Sheets API client returns rows from a
spreadsheet, it returns them as nested arrays, meaning that columns have to be
accessed by numerical index. To give an example, say you have a simple sheet
cataloguing people's programming experience, where each row represents a person:

```
| name | understands binary | years programming |
| --- | --- | --- |
| jean   | no   | 3   |
| kalil  | yes  | 6   |
```

Here's how the data would get returned by the Sheets API:

```python
['jean', 'no', '3']
['kalil', 'yes', '6']
```

So if you want to build out the schema, you have to make a map from the
attribute to the list index.

```python
{
    'name': 0,
    'understands binary': 1,
    'years programming': 2
}
```

The fastest way to make this would be to build the index by iterating the header row.

```python
schema = {}
for idx, col in enumerate(header):
    schema[col] = idx
```

Unfortunately, we were using different keys on the backend to refer to each
attribute. That meant the schema mapping would have to be done by hand. 

Recall that in the Google Sheets web app, as in most spreadsheet programs,
column indexes are displayed alphabetically. Column 1 is called 'A', column 2
is 'B', column 27 is 'AA', and so on.

[Image of the web app here]

For a small sheet, this wouldn't have been a problem: just count the columns to 
find the corresponding numerical index. Except our sheets were huge!
The biggest sheet we import has [**number of columns**] columns. 

Needless to say, adjusting the schema in the importer was going to be a
pain. I spent a few frustrated minutes trying to translate the
alphabetic columns to numerical indices, making sure the whole time to validate
that I was assigning the correct data type to each field. It was slow going,
and it was easy to mess up.

In the heat of this frustration, the dormant part of my brain that had
tried and failed to understand number bases lit up: **alphabetic columns are just
base-26 integers!** My problem wasn't that the columns were the wrong data type,
it was that they were the wrong _radix!_

Column BG, for example, had A (or 1) in the 1
position and B (or 2) in the 26 position, the same way that 53 has 3 in the
1 position and 5 in the 10 position. Translating between the two was
a simple matter of changing bases.

```python
'BG' = (26 * 2) + (1 * 7) = (10 * 5) + (1 * 9) = 59
```

From this perspective, the task had an easy solution:
a quick method to convert from base-26 to base-10, so that I could eyeball
the column that corresponded to each attribute.

```python
import string

def col(alph):
    '''
    Return a numeric index for an alphabetic column name, like:
        `'BG' -> 59`
    '''
    assert isinstance(alph, str)

    # Reverse the string and enforce lowercase
    alph = alph[::-1].lower()

    # Treat alphabetic column names like base-26 numerics.
    # Start at -1, since we want the result to be 0-indexed.
    total = -1
    for idx, letter in enumerate(alph):
        place = (26 ** idx)
        val = string.ascii_lowercase.index(letter) + 1
        total += (place * val)

    return total
```

The implications of this method amazed me. Not only are
spreadsheet columns base-26 integers; in fact, **every string is a base-26
integer**. If you remove the punctuation, this post is a base-26 integer!
Here's its base-10 representation:

```python
def parse(post):
    chars = [char.lower() for char in post if char in string.ascii_lowercase]
    return ''.join(chars) 

print(col(parse(post)))

<the post in base-10>
```

The fundamental insight of encodings, as I see it, is that **all symbolic
systems are interchangeable at a certain level of abstraction**. In the
encoding defined by `col`, the two symbolic systems are the Roman alphabet and the
Arabic numerals; the abstraction is the set of all integers. The level of
abstraction defines the relationship between the two systems. Both the alphabet
and the numerals are implicated in the definition of the hexadecimals,
for example, but in hexadecimal the two sets of symbols "mean" different things,
so the translation to and from alphabetic columns is different:

```python
'BG' = (26 * 2) + (1 * 7) = (16 * 3) + (11 * 1) = 3B
```

One key piece for me to understand was that there is no essential representation
of the set of all integers: base-10, binary, hexadecimal, and the alphabet are
all valid ways of communicating the abstraction that is "the integers." The
same can be said for the alphabet. Transliteration systems like
[Pinyin](https://en.wikipedia.org/wiki/Pinyin), for
instance, help capture the meaning of a text when moving from one encoding
(hànzì) to another (the Roman alphabet).

So much of computing relies on this fundamental insight. Relatively simple ideas like
file types, converters, and compression obviously implicate encodings, since
the programs that implement them often ask us to declare our encodings
explicitly. But more basic utilities like processors, compilers, and
programming languages all also rely on the fact that the
"ideas" (in this case, the procedures) that they describe can be translated and encoded
in a symbolic system that machines understand: binary strings.

To me, this is a foundational magic of computing. It's the insight that allows you
to accomplish amazing and strange feats like [storing any file as an album on
Bandcamp](). Or, if you'd like, printing a T-Shirt that can rip DVDs.
