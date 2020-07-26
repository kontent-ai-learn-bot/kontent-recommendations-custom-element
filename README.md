# Kontent Recommendations custom element

Kontent Recommendations custom element let's you setup and view your recommendations inside of the Kentico Kontent application. If you are new to Smart Kontent Recommendations, visit our [documentation](https://docs.kontent.ai/tutorials/develop-apps/build-strong-foundation/personalize-content-with-ai).

![Screenshot of custom element](element.gif)

## Features
The element let's you setup recommendations for a given content type directly from Kentico Kontent application. 

The recommendations are setup globally for a selected content type from the element's settings page. Whenever you create a new element, you'll see a visual representation of what items will be recommended. 

You are able to change the recommended items also for a specific content item, however you'll be warned when doing so as it is not a standard scenario and backend support for this is required. 

## Notes on using the element
- You are able to recommend only content types that you previously **registered** into the recommendation system - the custom element displays all content types, so **beware**.

- Support through the SDK/custom code is needed for this to work as you have to transform the value of the custom element into the recommendation request. 

- Be careful while trying to modify individual items as that may not be desirable in most cases. If you do modify settings for selected content items, don't forget you have to account for that in code that is actually requesting recommendations.

- Whenever you change the element's settings, keep in mind, that without republishing all of your already published content items of given type, the changes will be reflected only for new content items of that type. 

## Setup

1. Deploy the code to a secure public host
    * See [deploying section](#Deploying) for a really quick option
1. Follow the instructions in the [Kentico Kontent documentation](https://docs.kontent.ai/tutorials/develop-apps/integrate/integrating-your-own-content-editing-features#a-3--displaying-a-custom-element-in-kentico-kontent) to add the element to a content model.
    * The `Hosted code URL` is where you deployed to in step 1
    * Pass the necessary parameters as directed in the [JSON Parameters configuration](#json-parameters) section of this readme.

## Deploying

Netlify has made this easy. If you click the deploy button below, it will guide you through the process of deploying it to Netlify and leave you with a copy of the repository in your account as well.

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/strizr/kontent-recommendations-custom-module)

## Configuring the Custom Element

You will need to add the custom element to a content type filling in the hosted code URL and the JSON parameters (see below for details).

The JSON parameters required as as follows:

|Required | Name | Value | Description |
|---------| ---- | ----- | ----------- |
|*|count|int| Defines how many items of given type will be recommended |
|*|type|string| Defines the content type of recommended items |
||scenario|string| Defines what will your recommendations be based on. Currently, there are 3 possible values - default (selected if the parameter is omitted), popular, and similar. The default scenario combines both other scenarios. 

```json
{
    "count" : 3,
    "type" : "article",
    "scenario" : "popular"
}
```

## Developing

### Initial project setup

```console
npm install
```

### Compiles and hot-reloads for development

```console
npm run serve
```

### Compiles and minifies for production

```console
npm run build
```

### Lints and fixes files

```console
npm run lint
```

### Customize Vue CLI configuration

See [Vue CLI Configuration Reference](https://cli.vuejs.org/config/).

## Contributors

Originally contributed by [@RostaStriz](https://github.com/strizr)