title: It's Encodings All the Way Down 
summary: Encodings define representational systems for communicating abstractions. That's why they let you do magical things, like use a haiku, or a T-Shirt, to decrypt DVDs.
date: 2017-12-12
slug: encodings-all-the-way-down
thumbnail: /static/images/blog/encodings-all-the-way-down/decss-shirt.jpg
category: code
tags: abstraction and implementation; encodings; symbols 
published: true


Encoding is one of many simple but magical ideas that makes digital computing possible.
Everything that a digital computer does involves an encoding. Plus, a lot of what we do as humans to
communicate with each other involves encodings, too. I want to spend some time
appreciating just how amazing the idea of an encoding is&mdash;even though there's
no way I can do it the justice it deserves in one small blog post.

## A haiku that decrypts DVDs

In the 1990s, some entertainment companies used
an encryption protocol called CSS, or "content scramble system" (no relation to
the style sheet language)
to prevent users from playing DVDs on unapproved hardware. It was an early and
aggressive move toward DRM, and it proved to be a major source of frustration for
Linux users who couldn't use approved hardware.

But in 1999 a sixteen-year-old from Norway named Jon Lech Johansen figured out how CSS worked.
Johansen released a small C program called DeCSS that unlocked the encryption.
One result was that a lot of Linux users could
finally watch DVDs on their computers, and they were very grateful for Johansen's clever work.

Another result was that entertainment companies lost control over a critical piece of their
copyright infrastructure, and they were very angry about Johansen's clever
work. Johansen and his dad (because he was a minor) were arrested. Following
pressure from the MPAA, charges were brought against Johansen in Norway, and
the hacker magazine *2600*, among others, was sued for its involvement in
spreading the code.

In response to the aggressive legal action against DeCSS, free software
advocates published copies of DeCSS in a variety of outrageous formats in an attempt to
make the point that software is an encoded idea, not a product, and therefore should be
considered protected speech. David Touretzky collected a few of the cleverest
encodings of DeCSS in his [Gallery of CSS
Descramblers](http://www.cs.cmu.edu/~dst/DeCSS/Gallery/): T-shirts, dramatic
readings, mathematical proofs, and even a 456-stanza haiku.

The point was simple and clear: computers run on ideas&mdash;ideas that can
be encoded in so many different ways that attempting to restrict their spread
is both ethically misguided and practically impossible.[^coleman]

<img class="img img-responsive center-block"
     alt="A picture of a T-Shirt with the C implementation of DeCSS written on it."
     src="/static/images/blog/encodings-all-the-way-down/decss-shirt.jpg" />

<p class="text-center small">
    <em>DeCSS, encoded in T-Shirt form by the old
    <a href="http://web.archive.org/web/20040310112358/http://www.copyleft.net:80/item.phtml?dynamic=1&referer=%2Fitem.phtml%3Fdynamic%3D1%26page%3Dproduct_276_back.phtml&page=product_271_front.phtml">CopyLeft shop</a>.</em>
</p>

## A function that turns words into numbers

Another case that demonstrates the magic of encoding: number bases.
I've struggled with number bases for as long as
I can remember. Binary and hexadecimal in particular have always
vexed me, and I've relied on all sorts of kludges like color wheels to allow myself to work with
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

<div class="row">
    <div class="col-xs-12 col-md-6">
        <table class="table table-responsive table-bordered">
            <thead>
                <tr>
                    <th>name</th>
                    <th>understands binary</th>
                    <th>years programming</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>jean</td>
                    <td>false</td>
                    <td>3</td>
                </tr>
                <tr>
                    <td>kalil</td>
                    <td>true</td>
                    <td>6</td>
                </tr>
            </tbody>
        </table>
    </div>
</div>

Here's how the data would get returned by the Sheets API:

```python
['jean', 'false', '3']
['kalil', 'true', '6']
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

![A picture of a spreadsheet with alphabetic columns. The columns are 'A', 'B',
'Z', 'AF', 'AL', and
'AM'.](/static/images/blog/encodings-all-the-way-down/alphabetic-columns.png)

For a small sheet, this wouldn't have been a problem: just count the columns to 
find the corresponding numerical index. Except our sheets were huge!
The biggest sheet we import has 113 columns, and there are three sheets total. 

Needless to say, adjusting the schema in the importer was going to be a
pain. I spent a few frustrated minutes trying to translate the
alphabetic columns to numerical indices, making sure the whole time to validate
that I was assigning the correct data type to each field. It was slow going,
and it was easy to mess up.

In the heat of this frustration, the dormant part of my brain that had
tried and failed to understand number bases lit up: **alphabetic columns are just
base-26 integers!** My problem wasn't that the columns were the wrong data type,
it was that they were the wrong [_radix!_](https://en.wikipedia.org/wiki/Radix)

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

    # Treat alphabetic column names like base-26 numerics
    total = 0 
    for idx, letter in enumerate(alph):
        place = (26 ** idx)
        val = string.ascii_lowercase.index(letter) + 1
        total += (place * val)

    return total
```

(In the production code, we initialize `total = -1` to make sure that the
conversion is 0-indexed.)

The implications of this method amazed me. Not only are
spreadsheet columns base-26 integers; in fact, **every English word is a base-26
integer**. If you stripped out the numerals and the punctuation, this post could
be read as a base-26 integer! Here's a base-10 representation, for fun:

```python
def parse(post):
    chars = [char.lower() for char in post if char in string.ascii_lowercase]
    return ''.join(chars) 

print(col(parse(post)))

18229398602302566940514681623746853173134292647
```

The fundamental insight of encodings, as I see it, is that **all symbolic
systems are interchangeable at a certain level of abstraction**. In the
encoding defined by `col`, the two symbolic systems are "the Roman alphabet" and
"the Arabic numerals", both in turn encoded as ASCII characters.[^ascii] The abstraction
is the set of all integers. The level of abstraction defines the relationship between the two systems.

Both the alphabet and the numerals are implicated in the definition of the hexadecimals,
for example, but in hexadecimal the two sets of symbols "mean" different things,
so the translation to and from alphabetic columns is different:

```python
'BG' = (26 * 2) + (1 * 7) = (16 * 3) + (11 * 1) = 3B
```

One key piece for me to understand was that there is no essential representation
of the set of all integers: base-10, binary, hexadecimal, and the alphabet are
all valid ways of communicating the abstraction that is "the integers." The
same can be said for the alphabet itself. Transliteration systems like
[Pinyin](https://en.wikipedia.org/wiki/Pinyin), for
instance, help capture the meaning of a text when moving from one encoding
(hànzì, a set of Chinese characters) to another (the Roman alphabet).

So much of computing relies on this fundamental insight. Relatively simple ideas like
file types, converters, and compression obviously implicate encodings, since
the programs that implement them often ask us to declare our encodings
explicitly. But more basic utilities like processors, compilers, and
programming languages all also rely on the fact that the
"ideas" (in this case, the procedures) that they describe can be translated and encoded
in a symbolic system that machines understand: binary strings.

To me, this is a foundational magic of computing. It's the insight that allows you
to accomplish strange feats like [storing any file as an album on
Bandcamp](https://medium.com/@__Tux/using-bandcamp-as-a-backup-solution-3b6549d24579),
as well as simple tasks like saving a word processing document that feel mundane but
are actually full of wonder.

Or, if you'd like, printing a T-Shirt that can rip DVDs.

[^coleman]: For detailed history of the DeCSS case in the context of the
free software movement, see E. Gabriella Coleman's *[Coding Freedom: The Ethics
and Aesthetics of Hacking](https://press.princeton.edu/titles/9883.html)*
(Princeton: Princeton University Press, 2012), pages 170-9. [(PDF)](https://gabriellacoleman.org/Coleman-Coding-Freedom.pdf)

[^ascii]: The fact that both of these systems are internally represented as ASCII
characters in my machine is important, and makes things even more complicated.
Both the alphabet and the numerals have to show up on my screen somehow, so
there's actually a _third_ encoding system that sits between them, which is
ASCII. There are many other ways of encoding characters other than ASCII&mdash;
UTF-8 and UTF-16 are quite common too&mdash;and this choice of encoding in turn
affects the way that language itself is represented. For a deep dive on
character encodings see Eevee's [Dark Corners of
Unicode](https://eev.ee/blog/2015/09/12/dark-corners-of-unicode/); for a take
on the political implications of using ASCII to represent text, see Ramsey Nasser's
talk on [The Culture, Technology, Art, Design, and Politics of Programming
Languages](https://www.youtube.com/watch?v=VuuznaIus9k&feature=youtu.be&t=7m41s),
featuring a fascinating case study on a programming language he designed that
is written in Arabic. In brief: "Everything breaks when you don't use English
characters."
