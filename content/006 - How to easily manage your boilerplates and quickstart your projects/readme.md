<a name="TOC"></a>

<h1>How to easily manage your boilerplates and quickstart your projects</h1>

We as developers often need to create a brand new project which sometimes take long to setup it according to our needs and preferences.

In some cases, we have to literally spend hours configuring aux tools such as prettier, eslint, husky and so on.

To never experience that anymore, I developed a simple and powerful npm package, called boilermanager, to help developers to manage their own boilerplates.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/99iegibp0r7vjrxj8r8s.gif)
Example: the above image shows this tool creating an electron typescript application with all tools seted up in less than one minute

## How to use it

To use this tool, you have to install Node.js and Git.

After have those softwares installed, simple install the package globally in your computer by running this command:

```bash
npm install boilermanager -g
```

After that you can simple run any of the following options it the folder you want to create a new boilerplate project:

```bash
# you can either use "bpm" or "boilermanager"

bpm                      # will show all the nodejs default boilerplates
bpm -r [user/repository] # will show the boilerplates available in the specified repository
bpm -f [folder]          # will show the boilerplates available in the specified folder
```

## How to use it with my onw boilerplates?

I have created a [basic boilerplates repository template](https://github.com/lucasvtiradentes/boilermanager-boilerplates-template), so you can understand how to setup your own projects the way boilermanager will accept.

In general, you’ll have to:

- [Fork](https://github.com/lucasvtiradentes/boilermanager-boilerplates-template/fork) or [Copy](https://github.com/lucasvtiradentes/boilermanager-boilerplates-template/generate) this project to your github;
- Clone into your local machine and put your boilerplates according to this repository;
- Push the changes to your github remote repository, lets say it is `githubuser/yourboilerplates`
- Load your repository, by running:

```bash
bpm -r githubuser/yourboilerplates
```

## Final words

This project initially was meant to be used for Node.js related projects, but it also can be used for any other technologies. I’m even going to add Golang boilerplates (in other repository) in the future, when I become more proficient at it.

## Related

👉 If you want to check the repository source code, it is [here](https://github.com/lucasvtiradentes/boilermanager);
👉 You can also find the default boilerplates available [here](https://github.com/lucasvtiradentes/boilermanager-boilerplates);
👉 See also all [my projects](https://github.com/lucasvtiradentes/lucasvtiradentes/blob/master/portfolio/PROJECTS.md#TOC)
👉 See also all [my tutorials](https://github.com/lucasvtiradentes/my-tutorials/blob/master/README.md#TOC)
