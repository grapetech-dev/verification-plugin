
# Grapetech Shahada 2.0 Verification Plugin

> Shahdada 2.0 - Webapp Verification Plugin 

The verification plugin is an iframe based verification plugin for verifying the credentials which are generated by  Shahada 2.0 services.
The entities could use the follwing plugin code in there respective webpages.

## Implementation 
```html 
<!-- Copy the follwing where ever the verification plugin is needed -->
<!-- api-key is the key provided while onboarding the Entity -->
<div id="shahada" api-key="xxxx-xxxx-xxx-xxx-xxx"></div>

```

The Javascript CDN

```html 
<!-- The below script should be added to the end to the body -->
<script crossorigin="anonymous" type="text/javascript" src="//gist.githubusercontent.com/sivsivsree/070c2601252912e52f355d663d63ac8f/raw/7ecaedecefa8102a9010d9e4cf468def4cc8f7f2/shahada.js"></script>

```

## Communication
- Found a bug? Please open an issue.
- Have a feature request. Please open an issue.
- If you want to contribute, please submit a pull request

## Contributing

Please see our [Contributing](CONTRIBUTING.md) guidelines.
Contact [siv@grapetech.ae](mailto:siv@grapetech.ae) for information about contributing

## License

This project is licensed under Apache 2.0 and a copy of the license is available [here](LICENSE).
