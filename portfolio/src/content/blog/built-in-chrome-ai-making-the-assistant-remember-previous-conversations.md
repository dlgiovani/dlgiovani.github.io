---
title: "Built-In Chrome AI: Making the assistant remember the previous conversation (context aware)."
description: "[DEPRECATED] Since a recent update, there is a better method to make the assistant context aware. Check the official docs."
date: 2024-03-25
tags: ["Chrome", "AI"]
cover: "https://images.pexels.com/photos/2599244/pexels-photo-2599244.jpeg"
image_credit: {
    text: "Photo by Alex Knight",
    url: "https://www.pexels.com/photo/high-angle-photo-of-robot-2599244/"
}
---

> Go to "The solution" if you're in a hurry.

**[DEPRECATED] Since a recent update, there is a better method to make the assistant context aware. Check the official docs.**

<middots>&middot; &middot; &middot;</middots>

So, recently Chrome launched for developers and enthusiasts the new built-in version of Gemini on the app, an offline assistant running on your machine.

To access this API, make sure you are using a version of Chrome that is compatible (Canary or Dev ≥ 128). The options are listed for download below:

- [canary (nightly builds)](https://www.google.com/chrome/canary/)
- [dev (for devs)](https://www.google.com/chrome/dev/)

Once you download one of them, go to **chrome://flags** (write this on the url bar) and set:

- **Enables optimization guide on device** to _Enabled BypassPerfRequirements_;
- **Prompt API for Gemini Nano** to _Enabled_

After that, relaunch Chrome. Then open it again and go to **chrome://components**

There you should see a component called **Optimization Guide On Device Model**. Download it. (around 1.5 gigabytes, take care).

If it doesn't show up, press **f12** and go to the console. Write:

```javascript
await window.ai.createTextSession()
```

and press Enter. You should see the **Optimization Guide On Device Model** show up on the components list.

After that, relaunch chrome and, if it's all correct, this message will disappear so you can use the AI.

<middots>&middot; &middot; &middot;</middots>

## How to setup the basics

Before making the local version of Gemini Nano remember our conversation, you gotta setup a simple proof that it works. Paste this on your console:

```javascript
const canCreate = await window.ai.canCreateTextSession();

if (canCreate !== "no") {
  const session = await window.ai.createTextSession();

  // Prompt the model and stream the result:
  const stream = session.promptStreaming("Write me an extra-long poem");
  for await (const chunk of stream) {
    console.log(chunk);
  }
}
```

![a text stream from a generative AI](https://cdn-images-1.medium.com/max/960/1*TPk6ZfvaB2mOCnaQM7KceA.png)
You should then see this happening

\
The problem we are going to solve is that, if you prompt the AI about the past conversation (even from the same session), it can't answer you. It does not keep the context.

See an example on the [Vercel app](https://ai-sdk-chrome-ai.vercel.app/):

![a conversation with Gemini that shows that it does not supports context keeping naturally.](https://cdn-images-1.medium.com/max/960/1*RjyIQElvn5k7LunxoOSh2Q.png)
no more Ed Sheeran I guess. You were expecting a rickroll, weren't you?

\
As you can notice, it forgot the previous table and responded with a new one out of thin air. This is not what we want, so let's fix it.

## Making Gemini remember our previous messages

### The Research

You can provide a context to the built-in AI via the prompt itself. Differently from parameters such as temperature and top-k that you can define when creating a session, the context is fed on each user input.

There is a **special control sequence** that will let us provide the context. On the [official docs](https://docs.google.com/document/d/1VG8HIyz361zGduWgNG7R_R8Xkv0OOJ8b5C9QKeCjU0c/edit), this sequence has the purpose to help the model understand rounds of simulated interactions, a way to guide it to a desired output.

![the example from the docs](https://cdn-images-1.medium.com/max/960/1*6zbD5A4kkJS3OxZIIj0NBQ.png)
the example from the docs

\
As you can see, there is not much about context here.

But I had an intuition that we could extend this function, and based on some research I did about Gemini inner workings, I found a solution to achieve context behaviour with the model.

### The solution

On each prompt except for the first, we will pass the string to the _prompt_ function formatted like this:

```typescript
`${allPreviousMessages} <ctrl23> ${currentPrompt}`
```

We basically start the prompt with the previous messages separated by line breaks, the **special control sequence** (which is literally just the string _<ctrl23>_, not a fancy U+whatever symbol), and then finally the actual current prompt. The result of that is an AI aware of its context, as follows:

![This example shows the AI actually acknowledging the previous messages and taking them into consideration to make a new answer, so it is aware of the context.](https://cdn-images-1.medium.com/max/960/1*ZiqeEMOkysKs3wxrBm0n_Q.png)
Now we don't lose the previous context Also, using markdown on the model texts is a good idea!

\
You can test it yourself [here](https://dlgiovani.github.io/chrome-ai-webapp/).

Please notice that you need to limit the prompt size for optimal results. Prompts that are in the thousands of characters may break the model.

If you are wondering how the prompts look like, here is the first prompt:

```
make a table with 2 songs and its artists
```

and here is the second one:

```
make a table with 2 songs and its artists

 | Song Title | Artist |
|---|---|
| "Strawberry Fields Forever" | The Beatles |
| "Born This Way" | Lady Gaga |

     <ctrl23>
add a nirvana song to this table
```

And with a third prompt, it would become:

```
make a table with 2 songs and its artists

 | Song Title | Artist |
|---|---|
| "Strawberry Fields Forever" | The Beatles |
| "Born This Way" | Lady Gaga |


add a nirvana song to this table

 | Song Title | Artist |
|---|---|
| "Strawberry Fields Forever" | The Beatles |
| "Born This Way" | Lady Gaga |
| "Smells Like Teen Spirit" | Nirvana |

     <ctrl23>
What are the four seasons?
```

We keep growing this prompt until the treshold of 4096 characters, as per the docs. Personally, I wouldn't reccommend more than 1000. A 2552 chars long poem broke the model and it was a little annoying to make it work again. This could also be my old notebook's fault, though.

## That's all, folks!

You can see the repository for the context aware version at [this link](https://github.com/dlgiovani/chrome-ai-webapp/tree/main). Leave a star 🌟on the repo if you enjoyed!

<middots>&middot; &middot; &middot;</middots>

chrome app by me: https://dlgiovani.github.io/chrome-ai-webapp/ \
vercel app: https://ai-sdk-chrome-ai.vercel.app/ \
repo of my app on github: https://github.com/dlgiovani/chrome-ai-webapp/tree/main