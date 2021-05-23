<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title><?php echo($title);   ?></title>
  <link rel="stylesheet" href="https://unpkg.com/flickity@2/dist/flickity.min.css">
  <?php echo($css);  ?>
</head>
<body>
<script>
      WebFontConfig = {
        custom: {
          families: ["made", "madeoutline", "nikkyou", "SFProDisplay"],
          urls: ["assets/fonts/fonts.css"]
        }
      };

      (function(d) {
        var wf = d.createElement("script"),
          s = d.scripts[0];
        wf.src = "https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js";
        wf.async = true;
        s.parentNode.insertBefore(wf, s);
      })(document);
  </script>

  <?php  echo($content);  ?>
  <div class="desktop">
    <p>voor deze ervaring, ga naar mobile of tablet</p>
  </div>
  <?php echo($js) ?>
</body>
</html>
