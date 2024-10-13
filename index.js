document.addEventListener('DOMContentLoaded', function()
{
    var container = document.querySelector("#unity-container");
    var canvas = document.querySelector("#unity-canvas");
    var loadingBar = document.querySelector(".loader");

    if (!canvas || !loadingBar) 
    {
        console.error("Canvas or loader element not found!");

        return;
    }

    var buildUrl = "Build";
    var loaderUrl = buildUrl + "/TelegramMiniApp-DeadlyBet-WebBuild.loader.js";
    var config = {
        dataUrl: buildUrl + "/aa2967a3403853ca2ec519dda4950047.data.unityweb",
        frameworkUrl: buildUrl + "/9685490dffcbd28a85bb2f5ae23d539d.js.unityweb",
        codeUrl: buildUrl + "/b54e7accb2d738167329f19484c16055.wasm.unityweb",
        streamingAssetsUrl: "StreamingAssets",
        companyName: "BeniFun",
        productName: "Deadly Bet",
        productVersion: "1.0"
    };

    if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent))
    {
        var meta = document.createElement('meta');
        meta.name = 'viewport';
        meta.content = 'width=device-width, height=device-height, initial-scale=1.0, user-scalable=no, shrink-to-fit=yes';
        document.getElementsByTagName('head')[0].appendChild(meta);
    }


    loadingBar.style.display = "block";

    var script = document.createElement("script");
    script.src = loaderUrl;
    
    script.onload = () => 
    {
        createUnityInstance(canvas, config, (progress) =>
        {

        }).then((unityInstance) =>
        {
            unityInstanceRef = unityInstance;
            loadingBar.style.display = "none";
            console.log("Unity instance created successfully.");
        }
        ).catch((message) =>
        {
            console.error("Unity initialization error: " + message);
        });
    };

    script.onerror = (error) =>
    {
        console.error("Failed to load Unity loader script:", error);
    };
    document.body.appendChild(script);
});

window.addEventListener('load', function ()
{
    Telegram.WebApp.ready();
    Telegram.WebApp.expand();

    console.log("Telegram web app has been expanded to full screen");

    var version = Telegram.WebApp.version;
    var versionFloat = parseFloat(version);

    if (versionFloat >= 7.7)
    {
        Telegram.WebApp.disableVerticalSwipes();
        console.log('Activating vertical swipe disable');
    }

    console.log(`Telegram Web App opened with version: ${version}`);
    console.log(`Telegram Web App checked` +
        `latest version status with result: ${Telegram.WebApp.isVersionAtLeast(version)}`);
});
