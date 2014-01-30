UltraBox++ 0.5a
=======================
Detta är senaste versionen utav Ultrabox.

Installation
=============
* Kunskaper i HTML, CSS, PHP, JQUERY och AJAX
* MySQL Databas
* JavaScript tillåts i webbläsare
* Nyaste versionen utav FireFox.
* Filrättigheter på katalog uploads.
* Server
* Ett gott humör !

Ladda hem och packa upp
-----------------------
Kör en git clone https://github.com/egilviking/ultrabox, eller ladda hem zip versionen. 
Navigera till din ultrabox katalog och ladda upp denna till din utvecklingsserver. 
Ge katalog `uploads/` filrättigheter till 777.

Navigera till filen `proccessimages.php`, rad <strong> 3 </strong> till <strong> 5 </strong> är intressant.
<code><pre>	
$dsn 	= ''  //SERVER
$login 	= ''	//Användarnamn
$password = ''	//Lösenord
</pre></code>
<br>
Fyll här i din egen databas information, spara sedan filen och ladda upp till din utvecklingsserver.

Referensinstallation
--------------------
Peka nu din webbläsare mot din utvecklingsserver för att prova referensinstallationen.
Om felmeddelande `Could not connect to database, hiding connection details.` visas upp. <br>
Gör om föregående instruktion för att få din databas att fungera.

Sådär, din UltraBox referens hemsida ska vara uppe och visas !
Passa på att läsa kända buggar längst ner i denna readme innan du kör igång !

Användning
=============
Använd din UltraBox referenssida för att labba omkring.

Konfiguration
-------------
Du kan göra ändringar i bildstorlekar, design och animationer, prova detta i referensinstallationen. Eller freestyla och kopiera grejer till ditt egna projekt om du vet vad du gör.<br> 
Om du inte vet, men ändå vill freestyla så kommer en förklaring senare.

<b>proccessimages.php</b><br>
Rad <strong>23</strong>.<br>
Här kan du ändra höjd och storlek på bilderna som visas som thumbnails i preview och existing images.

```
// Size of thumbnails in preview and existing images.
$width = 80;
$height = 80;
```
<br><br>
<b>main.js</b><br>
Rad <strong>12</strong>.<br>
Här går det att ställa in tidsinställningar för olika animeringar. 1000 är 1 sekund.
```	
// Id of your drag n drop div. IMPORTANT
var $dnd = $("#dragndrop");	

// Slideshow
var $rotateSlideshow = 2000; // 2 sec
var $slideshowimagefade = 2000;

// Lightbox
var $lightboxfade	= 1000;

// Loadingimage
var $loadingimage = 1500;

// Html
var $htmldelay = 3000;
var $htmlfade = 1500;

// Forms
var $formfade = 2500;
var $submitfade = 1000;
```
<br><br>
<b>Caption - style.less</b><br>
Rad <strong>21</strong>.<br>
Caption är titel och text som visas i galleriet när man hovrar eller har klickat på en vald bild. Om det är en vald bild så visas caption tillsammans med lightbox effekten.
```
--------------------- Caption --------------------------
@caption-padding: 10px;
@caption-margin: 5px 0 0 0;
@caption-width: auto;
@caption-height: auto;
@caption-bg-color: none;
@caption-title-color: #EEE;	Title color
@caption-desc-color: #FFF; 	Text color
@caption-title-size: 16px;	Title size
@caption-desc-size: 13px; 	Text size
```
<br><br>
<b>Galleri - style.less</b><br>
Rad <strong>32</strong>.<br>
Här går det att styla galleriets utseende. Stora bilder kommer automatiskt förminskas ifall de är större än galleriet.
```
/--------------------- Gallery --------------------------/ 
@gallery-padding: 10px;
@gallery-width: 700px;
@gallery-height: auto;
@gallery-bg-color: #111;
@gallery-small-image-size: 40px; // Detta är storleken för thumbnailsen i nedre delen av galleriet.
@gallery-border: 1px solid #fff;
@gallery-current-img-border: 1px solid #eee;
```
<br><br>
<b>Slideshow - style.less</b><br>
Rad <strong>41</strong>.<br>
Här går det att styla slideshowens utseende. Bilder oavsett höjd och bredd kommer anpassa sig till slideshowens storlek.
```
/--------------------- Slideshow --------------------------/
@slideshow-width: 700px;
@slideshow-height: 150px;
@slideshow-bg-color: #eee;
@slideshow-z-index: 10;
@slideshow-margin: 0 auto 30px;
@slideshow-padding: 0;
@slideshow-border: 1px solid #fff;
```
<br><br>
Editering och anpassning
------------------------
Grundtanken med UltraBox är att det ska vara anpassningsbart och de olika funktionerna ska vara oberoende av varandra.
I grund och botten så är det omplacering och design utav html div element som är det intressanta, samt smärre ändringar i jquery och php koden.
Det ger möjlighet till att editera i stort sett hela UltraBox till utseende och beteende som man själv vill ha det.

För att inkludera UltraBox++ i ditt projekt gör följande. Utgår ifrån att det är samma katalogstruktur på ditt projekt som det är här.
Du behöver inkludera LESS CSS Kompilator och css fil i head på din site.
```
<link rel="stylesheet/less" type="text/css" href="css/style.less">
<script src="js/less.min.js"></script>
<script src="js/jquery.js"></script>
<script src="js/main.js"></script>
```
Det är viktigt att alla filer ifrån UltraBox++ finns i ditt projekt.<br>
På min referenssida så har jag lagt följande kod i vardera div boxar, detta är för att strukturera upp sidan.
Inkludera följande om så önskas.<br>
<strong>Drag N Drop</strong>
```	
<div id='dragndrop'>
	<h2>Upload images</h2>
	<!--Drag N Drop content here -->
	<h2>Drag and drop files.</h2>
</div>
```	
<strong>Manuellt uppladdningsformulär</strong>
```	
<form name="uploadPreview" enctype="multipart/form-data">
	<input type="file" name="file[]" multiple="true"/><br>
	<input type='submit' value='Upload and Preview'/>
</form>
```	
<strong>Förhandsvisning av nya bilder</strong>
```	
<h2>Preview images</h2>
<img class='spinnernewimages'/>
<div id='newimages'>
	<h3 id='uploadFiles'><!-- Upload complete message here --></h3>

	<form name="uploadFiles" enctype="multipart/form-data">
	<!-- New uploaded images shows here -->
	</form>
</div>
```	
<strong>Existerande bilder</strong>
```	
<h2>Existing images</h2>
<div id='images'><!-- Stored images shows here --></div>
```	
<strong>Slideshow</strong>
```
	<h2>Slideshow</h2>
	<div id='slideshow'><!-- Slideshow shows here --></div>
```	

<strong>Gallery</strong>
```
<h2>Gallery</h2>	
<div id='gallery'>
	<div class='gallery-current'>
		<!-- Clicked image shows here -->
		<div class='caption'>
		<!-- Caption show here --></div>
	</div>
	<div class='gallery-all'>
	<!-- Gallery here -->
	</div>
</div> 
```	
Förklaring
----------------------
Det är viktigt att id namnet på dessa element ej ändras. Det är jquery som selectar dessa div element och de behövs för att visa grejerna.

Under utveckling
=======================
Buggar
-----------------------
Kända buggar hittills är:<br>
<strong>Uppladdning bilder</strong><br>
Vid förhandsvisning av bildr så laddas bilder upp till katalogen uploads/ på servern.
Om man vid detta stadie stänger ner sidan, så går ej proccessen vidare och ingen information om bilden hamnar i databasen.

<strong>Galleri</strong><br>
Caption vid full storlek kan ibland visas felaktigt vid stora bilder.


TO DO's
-----------------------
<strong>Caption</strong><br>
* Fräscha upp css, ändra till id istället för klass.

<strong>Existerande bilder</strong><br>
* Sortera efter id, ej efter namn. Det gör att de nyaste hamnar först.

<strong>Slideshow</strong><br>
* Automatisk uppdatering när nya bilder läggs till
* Automatisk storleks anpassning av bilder, stora som små.

<strong>Galleriet</strong><br>
* Jämnare storleksanpassning, ser snyggare ut.
* Caption animeringen kan ibland lagga.

<strong>Misc</strong><br>
* Loading image är ej transparent
* Skilda Formulär ID's för styling.
