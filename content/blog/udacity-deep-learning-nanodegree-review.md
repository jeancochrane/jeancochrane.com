title: Udacity Deep Learning Nanodegree\: A Review
summary: I completed the Udacity Deep Learning Nanodegree so you don't have to. Unless, of course, you want to. In which case, this post can help you make that decision.
date: 2019-11-11
slug: udacity-deep-learning-nanodegree-review
category: code
tags: ml; ai; deep learning; udacity
published: true

From July to November 2019, I completed the [Udacity Deep Learning Nanodegree](https://www.udacity.com/course/deep-learning-nanodegree--nd101), a series of online courses focused on deep learning and neural networks.

I’d been interested in Udacity’s Deep Learning course for nearly a year, but I had trouble finding reliable reviews to help me decide whether to take it. The syllabus is available online, but it only touches on the content of the course, leaving aside questions of pedagogical approach and difficulty. Since the price tag was steep, I demurred for about a year before deciding to take the plunge.

If you’re feeling what I was feeling in July 2019 — interested in the Deep Learning Nanodegree, but unsure whether it’ll be a good fit for you — this post is intended to give you the information that I wish I had when making that decision.

<h2>Contents</h2>

*   [My background](#my-background)
*   [How the Nanodegree works](#how-the-nanodegree-works)
*   [The good](#the-good)
    *   [Embedded GPU-enabled Jupyter workspaces](#embedded-gpu-enabled-jupyter-workspaces)
    *   [Digestible content](#digestible-content)
    *   [Practical PyTorch experience](#practical-pytorch-experience)
    *   [Wide scope](#wide-scope)
*   [The bad](#the-bad)
    *   [Heavy on code, light on math](#heavy-on-code-light-on-math)
    *   [Too easy](#too-easy)
    *   [Shilling for Amazon Web Services](#shilling-for-amazon-web-services)
    *   [Exorbitant price](#exorbitant-price)
*   [Conclusion: Who should take the Deep Learning Nanodegree?](#conclusion)

<h2 id="my-background">My background</h2>


I’m a full-stack software engineer who mostly builds small-to-medium-sized data-driven web apps. I have no formal background in CS or math beyond high school calculus and statistics. I started the Nanodegree knowing a little bit about vanilla feedforward neural networks, but I had little knowledge of anything beyond that and no practical experience building them. I was hoping to have fun digging into a topic that interested me, and I wanted to gain practical skills in order to complete personal projects, but I didn’t have any professional goals related to deep learning when I started the program.

While I had no formal background in neural networks, I was broadly familiar with the basic concepts. I had read Michael Nielsen’s book _[Neural Networks and Deep Learning](http://neuralnetworksanddeeplearning.com/)_ (NNDL) in October 2018 with a group of bright programmers and mathematicians at the [Recurse Center](https://www.recurse.com/) and I’d thoroughly enjoyed it. I can’t recommend NNDL enough as a first introduction to deep learning. NNDL presented theory-oriented instruction in a clear, accessible style, and I finished it feeling hungry for similar work, ideally with a focus on more advanced topics.

After finishing NNDL, I made a few attempts at working through fast.ai’s [Practical Deep Learning for Coders](https://www.fast.ai/). Each time I was turned off by different aspects of the course that felt poorly constructed: the videos were painfully long, the course offered no exercises or problem sets to challenge the viewer, and running the notebooks required wrestling with cloud infrastructure that seemed to change every few months. I also really disliked the instructional tone, which felt condescending to me and lacked the deep mathematical beauty of NNDL. 

Around the same time I also considered working through Goodfellow, Bengio, and Courville’s _[Deep Learning](http://www.deeplearningbook.org/)_, but I found it too mathy and too light on programming for me to work through alone. I would have loved to read it with a group of mathematicians — I still would! — but it wasn’t a good next step for me after NNDL.

It was in this context that I decided to give Udacity’s Deep Learning Nanodegree a try. The Nanodegree seemed more digestible to a programmer than _Deep Learning_, and it seemed to be much better constructed than fast.ai’s courses. In general I think this initial impression was accurate, with a few important qualifications.

<h2 id="how-the-nanodegree-works">How the Nanodegree works</h2>

As of November 2019, the Deep Learning Nanodegree consists of six sequential units:

1. Introduction to Deep Learning
2. Neural Networks
3. Convolutional Neural Networks
4. Recurrent Neural Networks
5. Generative Adversarial Networks
6. Deploying a Model

The [November 2019 syllabus](https://d20vrrgs8k4bvw.cloudfront.net/documents/en-US/Deep+Learning+Nanodegree+Syllabus+8-15.pdf) goes into great detail about the instructional content of each unit, and I recommend reading it closely. Occasionally the videos seemed to reference a different set of units in a different order, which makes me think that these units and their sequence will likely change in the future, so refer to the [course page](https://www.udacity.com/course/deep-learning-nanodegree--nd101) for an updated syllabus.

Each unit presents 5-10 lessons focusing on a specific topic, such as gradient descent or weight initialization, and ends with an open-ended project implemented in a Jupyter notebook. Like other Udacity courses, the lesson videos are interspersed with short quizzes that check for basic comprehension of the preceding videos. These quizzes are occasionally supplemented by mini-projects that guide you through an implementation challenge in a Juypter notebook.

Over all, I spent somewhere between 5-10 hours a week and was able to complete the course in the expected 4 months.

I was hoping that the Nanodegree would offer some practice implementing neural networks, along with a deeper dive into the theory behind comparatively newer architectures like convolutional nets, recurrent nets, residual nets, and transformers. In some ways it met these goals; in others, there was room for improvement.

<h2 id="the-good">The good</h2>

<h3 id="embedded-gpu-enabled-jupyter-workspaces">Embedded GPU-enabled Jupyter workspaces</h3>

To me, the most egregious weakness of fast.ai’s course was that it was too hard to get the notebooks up and running, and for very little payoff. In order to run the notebooks you had to rent GPU-enabled machines from AWS or Paperspace, but since there were no exercises, the only reason to do so would have been to follow along with the videos.

Not only does Udacity include a good number of exercise notebooks — 2 or 3 per unit, plus a larger, open-ended project — but they also provide embedded GPU-enabled Jupyter notebooks directly in their web app. This meant that I could complete the course on a Chromebook without wasting time on a local development environment. From a learning perspective, this was a huge win.

<h3 id="digestible-content">Digestible content</h3>

Udacity presents the Nanodegree in six units, each of which is comprised of a series of 5-10 lessons, which are in turn comprised of anywhere between 10 and 30 short 3-5 minute videos.

When you add them up you get a lot of content, but each individual video felt easy to digest, and open to work through at my own pace. On days when I only had a free half hour for the course, I could watch a few videos, add a few [Anki flashcards](https://apps.ankiweb.net/), answer a quiz or two, and still make measurable progress. It felt easy to motivate myself to do this, and it allowed me to work at my own pace.

In contrast, it’s hard to make small, measurable progress on the multi-hour fast.ai videos or the thick chapters in _Deep Learning_.

<h3 id="practical-pytorch-experience">Practical PyTorch experience</h3>

As of November 2019, the Deep Learning Nanodegree uses PyTorch for implementing algorithms in code. If you search around for older materials online, you get the impression that this is a recent choice, since there’s lots of example code in Keras and TensorFlow.

The choice of PyTorch as a teaching framework was a good one. The PyTorch API is much more Pythonic than Keras or TensorFlow (although [I still have some bones to pick with it](https://jeancochrane.com/blog/pytorch-functional-api)) and its flexibility makes it a good instructional tool, giving the user lots of room to make custom low-level architectural decisions while still offering built-in utilities for a wide range of neurons, optimizers, and regularization techniques.

Plus, the nanodegree offers a lot of opportunities for practice implementing algorithms and training techniques. Having hit a wall with some personal projects, I appreciated the chance to write so much code in a structured environment.

<h3 id="wide-scope">Wide scope</h3>

The Deep Learning Nanodegree covers a lot of ground for four months. As we’ll see later, there are tradeoffs to this kind of breadth-first search, but the Nanodegree accomplishes its goal of introducing you to a lot of concepts in a short amount of time. Plus, the instructors do a good job of linking out to papers and other primary sources, offering signposts in case you want to dig deeper on any particular topic.

<h2 id="the-bad">The bad</h2>

<h3 id="heavy-on-code-light-on-math">Heavy on code, light on math</h3>

In contrast to NNDL, the Deep Learning Nanodegree is almost exclusively focused on code. The second unit includes some math, going into detail on gradient descent and regularization in feedforward networks. But the Nanodegree never comes close to the rigor of NNDL.

The tradeoff here is that the Deep Learning Nanodegree is probably approachable to a wider audience, but it does a lot of hand-waving to account for empirical results that it hasn’t explained. Course instructors offer a derivation of the gradient of vanilla feedforward networks during the second unit, but beyond that they never derive the gradient of the convolutional and recurrent networks they present -- derivations which are arguably more important to understand, since their networks suffer more strongly from vanishing gradients.

I was looking for something with a level of mathematical difficulty somewhere in between NNDL and _Deep Learning_, and I finished the Nanodegree feeling like I’d taken a step in the wrong direction.

<h3 id="too-easy">Too easy</h3>

Compared to more math-oriented texts like NNDL and _Deep Learning_, the Deep Learning Nanodegree felt easy. There were only a few moments when I had to work hard to reach real understanding, largely in the second unit, which provided the theory behind gradient descent and feedforward neural networks. And importantly, the hard work I had to do to gain understanding was largely motivated by my own curiosity; I didn’t necessarily need to have this level of understanding to meet the requirements of the course.

On the one hand, the Nanodegree’s low difficulty level contributes to a low barrier to entry. You really do only need basic Python knowledge and high school math to complete it, just as they say in the syllabus. But I only have high school math under my belt and I still felt like I could handle NNDL; indeed, the challenge of gaining mastery over the text was fulfilling. I was hoping to be similarly challenged by the Deep Learning Nanodegree and I was mostly disappointed.

<h3 id="shilling-for-amazon-web-services">Shilling for Amazon Web Services</h3>

The first five units of the Nanodegree struck a nice balance between theory and implementation, with a focus throughout on concrete applications. However, the final unit, “Deploying a Model,” was entirely devoted to teaching students how to operate Amazon Web Service’s SageMaker service.

I appreciate the practical benefit of putting your code in production, but devoting a full sixth of the program to one specific cloud service felt like a waste of time at best, and a superliminal advertisement at worst.

If you need to have production deep learning experience for a job application or a credential, this unit might be useful to you. But as someone who already regrets the amount of time I’ve spent on AWS in my professional life, and who is mostly interested in the theory behind neural networks, I didn’t feel like I got anything useful out of the unit.

<h3 id="exorbitant-price">Exorbitant price</h3>

My biggest hesitation with the Nanodegree before enrolling was the price tag. I was worried I wouldn’t get anything close to the value of the sticker price, particularly because I wasn’t primarily motivated by career advancement.

In the end, I think my worry was justified. The Nanodegree is overpriced for what it provides. The instructional videos are high quality, but many of the exercises are lifted directly from Kaggle or from research papers, and there still aren’t enough of them. The Nanodegree also offers a lot of personalized services that I consider expensive but low-value, like career coaching and 1on1 mentoring. As a self-motivated learner, these kinds of services only draw resources away from the product that I really care about: quality instructional content and challenging exercises.

Beyond the steep price, I also felt that the subscription model was detrimental to my learning. The Nanodegree was self-paced, meaning you didn’t have to stick to a set schedule, but you had to pay the same amount every month. I felt like I had to rush toward the end of the course to avoid an extra monthly payment, and this made me brush past topics I was interested in instead of pausing to learn more. As someone with a lot of curiosity but very little free time, this was a painful choice to have to make.

The pricing model for Udacity courses seems like it changes a lot, so my concerns over pricing may change in the future. Many people also get their bosses to pay for courses like these, so maybe price isn’t even a concern for you. But as someone working on the Nanodegree on my own time to satisfy my own curiosity, the price and the subscription model were strong negatives.

<h2 id="conclusion">Conclusion: Who should take the Deep Learning Nanodegree?</h2>

The Deep Learning Nanodegree might be a good fit for you if you’re eager to get some practical experience building neural networks, you’re not too concerned about math, and you have a way to pay for an expensive course.

If, on the other hand, you’re interested primarily in theory, you want to go deep into the details, or you already have a handle on the basics of neural networks and deep learning, the Nanodegree probably won’t deliver the value you’re looking for. I’d instead try [Nielsen’s book](http://neuralnetworksanddeeplearning.com/) for a basic introduction, or [Goodfellow, Bengio, and Courville’s book](http://www.deeplearningbook.org/) for advanced instruction. In both cases, I would strongly recommend convening a reading group around the book, ideally including mathematicians.

In the end, I think the course was a good use of my time. I got unstuck on some personal projects, I got ideas for new ones, and I was introduced to a lot of interesting ideas and good research papers. But I don’t expect these conditions to hold for every learner, and I want you to make the best choice you can with the information available to you.
