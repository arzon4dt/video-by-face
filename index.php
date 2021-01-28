<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Document</title>
  <script defer src="face-api.min.js"></script>
  <script defer src="script.js"></script>
  <style>
    body {
      margin: 0;
      padding: 0;
      width: 100vw;
      height: 100vh;
      display: flex;
      justify-content: left;
      align-items: center;
    }

    canvas {
      position: absolute;
    }
  </style>
</head>
<body>
  <video id="video" width="360" height="280" autoplay muted></video>
  <div id="player"></div>
</body>
</html>