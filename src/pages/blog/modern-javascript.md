# Javascript
Originally designed for browsers Javascript has weasled its way into every part of the userspace of consumer machines, most commonly as embeded browser applications. This is quite unfortunate for a few reasons
    - Waste of resources, native libraries exist
    - Depepdency on V8
    - Interpreted exeuction environments are less secure
    - Over-reliance on Network stack
    - Single-threaeded (technical issue)

But what if you can just have one group do the heavy lifting and ship the runtime to everyone; thus creating a multiplatform environment. Java was an indication that consumers were willing to install a runtime environment to run their favorite applications, why not another?

# Web Development
My journy of Web Development prior to this went:
JavaScript/JQuery -> Ruby -> Python -> Node

and I think that gave me a lot of clarity in understanding the roots of the JavaScript ecosystem. Originally designed for browsers it was meant to just be a quick and easy way make dynamic webpages with some features of functional languages of the time. As the Internet grew and demand for websites increased the need for webservers also grew, and Chrome's marketshare also grew. Google decided to be nice and open source V8 and all of a sudden you had a cross-platform (if you could get it to build) iterpreter that beat out Python by miles and had first class functions, but it was single threaded...

# Threads
Threads aren't real. You're cores, they're real. Your threads, they're fake: implemented by developers lower on the stack, with scheduling algorithms only known as the dark arts.

Rust tried to be realllllly cute about it. Thought they could get away with implementing green threads on an language-level to serve `[no_std]` envionrments. Heh

Threads are typically implemented on an Operating-System level. Modern systems then deligated threads per process, and then has a scheduler attempt to distribute the workload, but this is far easier said than done (optimally)

So why does NodeJS single threaded nature raise concerns? Well first off I extremely do not want my code running on a single core and I also don't want my code be exposed to speculative branching

 Well First off NodeJS is not much of a technical innovation as it is a wrapper around Google's V8, and I would say more to the potential of the project but I think the existance of a NodeJS documentary at this early of it's lifecycle is a little telling of management's priorities.

NodeJS is just a few dudes, Google is a machine. They know this, and because of this they can't touch too much of V8 or else MERGE CONFLICT. Sure they can extend a few things here and there, but I think the existance of Bun is proving to show that there's a new wave coming along. Hopefully with an actual threading api this time.