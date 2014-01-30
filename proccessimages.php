 <?php
// Connect to a MySQL database using PHP PDO
$dsn      = 'mysql:host=blu-ray.student.bth.se;dbname=pesj13;'; //IMPORTANT !
$login    = 'pesj13';																						//IMPORTANT !
$password = '88AUg$4P';																					//IMPORTANT !
$options  = array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES 'UTF8'");
try {
  $pdo = new PDO($dsn, $login, $password, $options);
}
catch(Exception $e) {
  //throw $e; // For debug purpose, shows all connection details
  throw new PDOException('Could not connect to database, hiding connection details.'); // Hide connection details.
}

// Some variables
$countImages = 0;
$error = false;
$uploaddir = 'uploads/';
$html = null;
$information = null;
$totimages = 0;

// Size of thumbnails in preview and existing images.
$width = 80;
$height = 80;


//Get action from jQuery.
$action = isset($_GET['action']) ? $_GET['action'] : null;

switch($action) {
	case 'new':
		//If the global files contains images, then save the information to html.
		if(isset($_FILES)){
			foreach($_FILES as $file)	{
				$allowedExts = array("gif", "jpeg", "jpg", "png");
				$temp = explode(".", $file["name"]);
				$extension = end($temp);
				if ((($file["type"] == "image/gif")
				|| ($file["type"] == "image/jpeg")
				|| ($file["type"] == "image/jpg")
				|| ($file["type"] == "image/pjpeg")
				|| ($file["type"] == "image/x-png")
				|| ($file["type"] == "image/png"))
				&& ($file["size"] < 200000000)
				&& in_array($extension, $allowedExts)){
					
					if ($file["error"] > 0){
						$error .= "Return Code: " . $file["error"] . "<br>";
					}
					//File seems to be fine, proceed.
					else{
						$information .= " Upload: " . $file["name"] . "<br>";
						$information .= " Type: " . $file["type"] . "<br>";
						$information .= " Size: " . ($file["size"]) . " kB<br>";
						$information .= " Temp file: " . $file["tmp_name"] . "<br>";
						
						//If file already exists.
						if (file_exists("uploads/" . $file["name"])){
							$information .= $file["name"] . " already exists. No upload here ";
							$html .= '<h3 class="redinfo imgexists">'. $file["name"] . " already exists. No upload here</h3>";
						}
						else{
							move_uploaded_file($file["tmp_name"],"uploads/" . $file["name"]);
							$information .= "Stored in: " . "uploads/" . $file["name"];
					
							//Create the html string with the image information and inputs.
							$html .= "
								<img src='uploads/".$file["name"]."' alt='".$file["name"]."' height='".$height."' width='".$width."'/><br>
								<label>Title</label><br>
								<input type='text' name='titles[]' class='req'/><br>
								<label>Caption</label><br>
								<input type='text' name='captions[]' class='req'/><br>
								<input type='hidden' name='image[]' value='".$file["name"]."'/>
								<input type='button' class='link' data-image='uploads/".$file['name']."' value='Show fullscreen image'/><br><br>
								";
							$totimages++;	
						}
					}
				}
				else{
					$html .= '<h3 class="redinfo imgerror">'. $file["name"] . " is invalid.</h3>";
				}
			}
			
			//The html creation is done, add the submit button to the form.
			if($totimages > 0)	{
				$html .=	"<br><input class='submitbutton preview' type='submit' value='Save Images'/>";
			}
		}
	break;
	
	case 'save':
		$images = array();
		//Query the database, sqllite ?
		if(isset($_POST)){
			
			//Transform the incoming array.
			for($x=0;$x<count($_POST['titles']);$x++){
				$images[$x]['title'] = strip_tags($_POST['titles'][$x]);
				$images[$x]['caption'] = strip_tags($_POST['captions'][$x]);
				$images[$x]['image'] = strip_tags($_POST['image'][$x]);
			}
			
			//Query the database.
			foreach($images as $key => $imageArr){
				//Check if the file doesn't already exists in uploads/database.
				if(file_exists("uploads/".$imageArr['image'])){
						//Iterates trough each image and inserting them into database.
						$sql = "INSERT INTO images (title, caption, image) VALUES (:title, :caption, :image)";
						$stmt = $pdo->prepare($sql);
						$stmt->execute($imageArr);
				}else{
					$error .= "Can't find image: uploads/".$imageArr['image'].", no saving to database.";
				}
			}
		}
	break;
	
	case 'deleteimage':
		if(isset($_POST['id'])){
			$id = null;
			$id = $_POST['id'];
			$image = $_POST['image'];
			$information = $id;
			$path = "uploads/".$image;
			
			//Select query the database.
			$sql = "DELETE FROM images where id=?";
			$stmt = $pdo->prepare($sql);
			$stmt->execute(array($id));
			$result = $stmt->fetchAll();
					
			if(isset($_POST['image'])){
				if(file_exists($path)){
					unlink($path);
				}
				$html = "Image deleted in uploads: ".$image;
			}
		}
	break;
	
	case 'loadimages':
		//Will hold the result from database.
		$result = null;
		
		//Select query the database.
		$sql = "SELECT image, id FROM images";
		$stmt = $pdo->prepare($sql);
		$stmt->execute();
		$result = $stmt->fetchAll();
		
		//Iterate trough the array of image.
		foreach($result as $key => $value){
			$html .= "<img src='uploads/{$value['image']}'alt='{$value['image']}' height='{$height}' width='{$width}' id='{$value['id']}'/>";
		}
	break;
	
	case 'loadimageform':
		if(isset($_POST['id'])){
			$id = null;
			$id = $_POST['id'];
			$information = $id;
			$query = array();
			$query[] = $id;
			
			$sql = "SELECT * FROM images WHERE id=?";
			$stmt = $pdo->prepare($sql);
			$stmt->execute($query);
			$result = $stmt->fetch();
			extract($result);
			
			//Slideshow Checkbox
			if($slideshow){
				$ssChecked 	 = "checked='checked'";
			}
			else{
				$ssChecked 	 = "unchecked='unchecked'";
			}
			
			//Gallery Checkbox
			if($gallery){
				$glChecked	 = "checked='checked'";
			}
			else{
				$glChecked 	 = "unchecked='unchecked'";
			}
		
			$html = "
			<form name='updateImage'>
				<label>Title</label><br>
				<input type='text' name='title' value='{$title}'/><br>
				<label>Caption</label><br>
				<input type='text' name='caption' value='{$caption}'/><br>
				<label>Slideshow : </label><input type='checkbox' name='slideshow' value='{$slideshow}' {$ssChecked} /><br>  
				<label>Gallery : </label><input type='checkbox' name='gallery' value='{$gallery}' {$glChecked} />	<br>

				<input type='hidden' name='id' value='{$id}'/>
				<input type='hidden' name='image' value='{$image}'/>
				
				<input type='button' id='link' class='lightboxlink' value='Show fullscreen image'/><br><br>
				
				<input type='button' class='red' name='delete' value='Remove image' id='deleteimage'/> 
				<input type='reset' class='blue' name='resetform' value='Reset'/>
				<input type='submit' class='green' value='Save'/>
				<br>
				<span class='note'>Click any image to close this form.</span>
			</form>
			";
		}
	break;
	
	case 'updateimage':
		if(isset($_POST)){
			$id = null;
			$title = null;
			$caption = null; 
			$gallery = null;
			$slideshow = null;
			
			$title = strip_tags($_POST['title']);
			$caption = strip_tags($_POST['caption']);
			$slideshow = isset($_POST['slideshow']) ? $_POST['slideshow'] : false;
			$gallery = isset($_POST['gallery']) ? $_POST['gallery'] : false;
			$id = $_POST['id'];
			
			$sql = "UPDATE images SET title=?, caption=?, slideshow=?, gallery=? WHERE id=?";
			$stmt = $pdo->prepare($sql);
			$stmt->execute(array($title,$caption,$slideshow,$gallery,$id));
			
			$html = "Image information updated.";
		}
	break;
	
	case 'loadslideshow':
			$sql = "SELECT image FROM images WHERE slideshow=1";
			$stmt = $pdo->prepare($sql);
			$stmt->execute();
			$result = $stmt->fetchAll();
			
			//Build the img html tags.
			foreach($result as $key => $value){
				$html .= "<img src='uploads/{$value['image']}'alt='test'/>";
			}
	break;
	
	case 'loadgallery':
			
			$sql = "SELECT image, title, caption FROM images WHERE gallery=1";
			$stmt = $pdo->prepare($sql);
			$stmt->execute();
			$result = $stmt->fetchAll();
			
			//Build the img html tags.
			foreach($result as $key => $value){
				$html .= "<img src='uploads/{$value['image']}'alt='test' data-title='{$value['title']}' data-caption='{$value['caption']}'/>";
			}
	break;
	
	default: 
		$html = 'default';
	break;
}

// Deliver the response, as a JSON object containing the name of the user.
header('Content-type: application/json');
echo json_encode(array(
	"html"			  => $html,
	"error"			  => $error,
	"information" => $information,
	"totalimages" => $totimages,
));
?>