(() => {

    const VERIFYURL = 'http://shahadauoduat.uaenorth.cloudapp.azure.com:5052/v1/certificate-verify';

    let css =
        `#shahada *{box-sizing:border-box;padding:0;margin:0;font-family:Tahoma,sans-serif}
#shahada .grid{display:flex;font-family:Tahoma,sans-serif}
#shahada .grid .grid-list ul{padding:16px}
#shahada .grid .grid-list li{list-style:none;font-size:12px;margin-bottom:1.3em}
#shahada .grid .grid-list li div{margin-bottom:.5em;text-overflow:ellipsis;line-break:anywhere;font-size:12px}
#shahada .hr{border-top:1px solid #f1f2f3}
#shahada .verified{padding:10px;box-sizing:border-box;border-left:3px solid;margin:16px}
#shahada .is-success{background-color:rgba(42,178,123,0.1);border-color:#2ab27b}
#shahada .is-error{background-color:rgba(245,17,17,0.1);border-color:#f90e0e}
#shahada .check:before{display:inline-block;vertical-align:top;line-height:1em;width:1em;height:1em;margin-right:.3em;text-align:center;content:'✔';color:#2ab27b}
#shahada .shahda-footer{height:50px;margin:10px}
#shahada .shahda-footer img{height:100%}`;

    const head = document.head || document.getElementsByTagName('head')[0],
        style = document.createElement('style');

    head.appendChild(style);

    style.type = 'text/css';
    if (style.styleSheet) {
        // This is required for IE8 and below.
        style.styleSheet.cssText = css;
    } else {
        style.appendChild(document.createTextNode(css));
    }


    /* Adding the elememts */
    const shahada = document.getElementById("shahada");

    const fileSelect = document.createElement("div");
    fileSelect.setAttribute("style", "font-family: Tahoma,sans-serif;");


    const inputRow = document.createElement("div");
    inputRow.setAttribute("style", "padding: 8px;");

    const file = document.createElement("input");
    file.setAttribute("type", "file");
    file.id = 'file-selector';
    file.setAttribute("style", "display: none");
    file.setAttribute("accept", "application/pdf");

    const progressBar = document.createElement('div');
    progressBar.id = 'progressBar';
    progressBar.setAttribute('style', "background-color: #f1f1f1!important;display:none;");
    progressBar.innerHTML = '<div id="myBar" style="height:4px;width:0;color: #fff!important; background-color: #1185c6!important;"></div>';

    const fileLabel = document.createElement("label");
    fileLabel.id = 'file-label';
    fileLabel.setAttribute("for", "file-selector");
    fileLabel.setAttribute("style", "padding: 16px; width:100%; color:#1185c6; font-size: 14px;display: block;font-family: Tahoma,sans-serif;  border: 1px solid #1185c6;");
    fileLabel.innerText = 'Select or Drag and Drop certificate for verification';

    inputRow.append(file, progressBar, fileLabel);


    const footerRow = document.createElement("div");
    footerRow.setAttribute("style", "padding: 8px; margin-top: 4px; display: flex;");

    const _footerImg = document.createElement("img");
    _footerImg.setAttribute("style", "height: 30px;");
    _footerImg.setAttribute("src", "https://shahada.azurewebsites.net/wp-content/uploads/2020/01/Shahada-logo-2.svg");

    const _footerCredits = document.createElement("div");
    _footerCredits.setAttribute("style", "margin-left:7px; padding-left:7px; font-size: 10px; border-left: 1px solid #ddd;");

    const _creditsPowered = document.createElement("div");
    _creditsPowered.setAttribute("style", "padding: 2px;");
    _creditsPowered.innerHTML = `Verification powered by <a style="text-decoration: none;color: #00732f" href="https://www.shahada.ae">Shahada</a>`;

    const _creditsTerms = document.createElement("div");
    _creditsTerms.setAttribute("style", "padding: 2px;");
    _creditsTerms.innerHTML = `<a style="text-decoration: none; color: #b2b2b2" target="_blank" href="https://www.shahada.ae/terms">Terms and Conditions</a>`;


    _footerCredits.append(_creditsPowered, _creditsTerms);
    footerRow.append(_footerImg, _footerCredits);
    fileSelect.append(inputRow, footerRow);
    shahada.append(fileSelect);

    file.addEventListener('change', event => {
        handleImageUpload(event)
    });

    const handleImageUpload = event => {

        const id = startLoading();
        const files = event.target.files;
        const file = files[0];

        const fileLabel = document.getElementById("file-label");
        fileLabel.innerText = 'Verifying ' + file.name;

        const formData = new FormData();
        formData.append('file', files[0]);

        const apiKey = document.getElementById('data-apikey');

        if (!apiKey) throw new Error("data-apikey is not provided");

        fetch(VERIFYURL, {
            method: 'POST',
            body: formData,
            headers: {
                'Authorization': 'Bearer ' + apiKey
            },
            redirect: 'follow'
        }).then(response => response.json())
            .then(data => {
                if (data && data['status']) {
                    if (data['valid']) {
                        openModel(data, null);
                        document.getElementById("pdf-preview").src = data['url'];
                    } else {
                        openModel(null, "Not a valid Credential.");
                    }
                } else {
                    openModel(null, "Invalid Credential");
                }
            })
            .catch(error => {
                console.error(error);
                openModel(null, "Verification failed");
            })
            .finally(() => {
                stopLoading(id);

            })

    };

    const verificationStatus = (v) => {
        let badge = '';

        if (!v.pdf) {
            badge =
                `<div class="verified is-error">
                    <div style="display:flex">
                    <div></div>
                    <div style="padding-left: 8px;padding-top: 3px;">Credential Not valid</div>
                </div>
                <div style="font-size: 12px; margin-top:8px;">
                    <div class="">PDF is invalid or tampered</div>
                </div>
                </div>`;
        }

        if (!v.cjson) {
            badge =
                `<div class="verified is-error">
                    <div style="display:flex">
                    <div></div>
                    <div style="padding-left: 8px;padding-top: 3px;">Credential Not valid</div>
                </div>
                <div style="font-size: 12px; margin-top:8px;">
                    <div class="">JSON data invalid</div>
                </div>
                </div>`;
        }

        if (v.isRevoked) {
            badge =
                `<div class="verified is-error">
                    <div style="display:flex">
                    <div></div>
                    <div style="padding-left: 8px;padding-top: 3px;">Credential Revoked</div>
                </div>
                <div style="font-size: 12px; margin-top:8px;">
                     <div class="check">PDF signed and not tampered</div>
                     <div class="check">Format Validation</div>
                     <div class="">Credential is revoked</div>
                </div>
                </div>`;
        }


        if (v.pdf && v.cjson && !v.isRevoked) {
            badge = `<div class="verified is-success">
                <div style="display:flex">
                <div><img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjBweCIgaGVpZ2h0PSIyM3B4IiB2aWV3Qm94PSIwIDAgMjAgMjMiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8ZyBpZD0iVmVyaWZpY2F0aW9uIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8ZyBpZD0iMyIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTI1NC4wMDAwMDAsIC00NzQuMDAwMDAwKSIgZmlsbD0iIzJBQjI3QiI+CiAgICAgICAgICAgIDxnIGlkPSJHcm91cCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMjQ4LjAwMDAwMCwgNDY5LjAwMDAwMCkiPgogICAgICAgICAgICAgICAgPHBhdGggZD0iTTE2LDUgTDYsOS4xODE4MTgxOCBMNiwxNS40NTQ1NDU1IEM2LDIxLjI1NjgxODIgMTAuMjY2NjY2NywyNi42ODI3MjczIDE2LDI4IEMyMS43MzMzMzMzLDI2LjY4MjcyNzMgMjYsMjEuMjU2ODE4MiAyNiwxNS40NTQ1NDU1IEwyNiw5LjE4MTgxODE4IEwxNiw1IEwxNiw1IFogTTksMTcuNzUzNzE1NSBMMTAuNTI3NSwxNi4yNTY5MDAyIEwxMy4zMzMzMzMzLDE4Ljk5NTc1MzcgTDIwLjQ3MjUsMTIgTDIyLDEzLjUwNzQzMSBMMTMuMzMzMzMzMywyMiBMOSwxNy43NTM3MTU1IFoiIGlkPSJTaGFwZSI+PC9wYXRoPgogICAgICAgICAgICA8L2c+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4="></div>
                <div style="padding-left: 8px;padding-top: 3px;">Certificate Valid</div>
            </div>
            <div style="font-size: 12px; margin-top:8px;">
            <div class="check">PDF signed and not tampered</div>
            <div class="check">Format Validation</div>
            <div class="check">Credential Status</div>
            </div>
            </div>`;
        }


        return badge
    };


    const openModel = (data, error) => {

        const model = document.createElement("div");
        model.id = "dialogue";
        model.setAttribute("style", "display: block; position: absolute; width: 100%; height:100%; top:0; left: 0; background: #fff;");

        let resultValue = ``;

        console.log(data, data);
        if (data) {

            const issueDate = new Date(data.json.issuedOn);
            const issuer = data.json.badge.issuer;

            resultValue = `
                    ${verificationStatus(data.verification)}
                    <ul>
                        <li>
                            <div><b>ISSUE DATE</b></div>
                            <div>${issueDate.toDateString()}</div>
                        </li>

                         <li>
                            <div><b>ISSUER</b></div>
                            <div>${issuer.name}</div>
                        </li>

                         <li>
                            <div><b>ISSUED TO</b></div>
                            <div>${data.json.recipientProfile.name}</div>
                        </li>

                         <li>
                            <div><b>TRANSACTION ID</b></div>
                            <div>${data.json.verification.publicKey}</div>
                        </li>
                    </ul>
                    <div class="hr"></div>  <div class="shahda-footer"><img src="https://shahada.azurewebsites.net/wp-content/uploads/2020/01/Shahada-logo-2.svg"></div>`


        } else {

            resultValue = `
                    <div class="verified is-error">
                        <div style="display:flex">
                          <div><img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxOCIgaGVpZ2h0PSIxOCIgdmlld0JveD0iMCAwIDE4IDE4IiBmaWxsPSIjRjVBNjIzIj48cGF0aCBkPSJNLjUgMTZoMTdMOSAxIC41IDE2em05LjUtMkg4di0yaDJ2MnptMC0zSDhWN2gydjR6Ii8+PC9zdmc+IA=="></div>
                          <div style="padding-left: 8px;padding-top: 3px;">Invalid Certificate</div>
                        </div>
                    </div>
                    <div class="hr"></div> <div><img class="shahda-footer" src="https://shahada.azurewebsites.net/wp-content/uploads/2020/01/Shahada-logo-2.svg"></div>`

        }


        model.innerHTML = `
            <div class="grid">
                <div class="grid-list" style="width: 350px; border-left: 1px solid #f1f2f3;">
                    <div style="text-align: left">
                        <button style="background: #ddd; border: 1px solid #ddd; width: 30px; height: 30px;" onclick="document.getElementById('dialogue').remove();document.getElementById('file-selector').value = '' ">
                            X
                        </button>
                    </div>${resultValue}</div>
                <div class="grid-list" style="width:100%; height: 100vh">
                    <embed id='pdf-preview' src="" type="application/pdf" height="100%" width="100%">
                </div>
            </div>`;

        shahada.appendChild(model);

    };

    const startLoading = () => {

        const progressBar = document.getElementById("progressBar");
        progressBar.style.display = "block";
        const elem = document.getElementById("myBar");
        // elem.style.transition = '0.1s linear all'
        let width = 0;

        function frame() {
            if (width >= 100) {
                width = 1;
            } else {
                width += 0.05;
                elem.style.width = width + '%';
            }
        }

        return setInterval(frame, 10);

    };

    const stopLoading = (id) => {
        clearInterval(id);
        const progressBar = document.getElementById("progressBar");
        const fileLabel = document.getElementById("file-label");
        fileLabel.innerText = 'Select or  Drag and Drop certificate for Verification';
        progressBar.style.display = "none";
    };


})();
