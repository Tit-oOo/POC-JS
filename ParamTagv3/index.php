<?php 
if (isset($_POST['perso'])) {
  echo creerTableauJSON($_POST['perso']);
}

function creerTableauJSON($PV_value) {
	$tabJson = array();
	foreach ($PV_value as $index => $value) {
		if ($value == '') { continue; }
		else {
			if ($index == 'tag') {
				$tabJson['base']['tag'] = $PV_value['tag'];
			}
			else if ($index == 'attrName' && $PV_value['attrValue'] != '') {
				$tabJson['base']['attr'][$index] = $PV_value['attrValue'];
			}
			else if ($index != 'attrValue') {
				$tabJson[$index] = $value;
			}
		}
	}
	return json_encode($tabJson);
}

?>
<html>
<head>
<script type="text/javascript" src="nDuplicate.js"></script>
<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.10.1/jquery.min.js"></script>

</head>
<body>

<form action="" method="POST">

<label>Tag : <input type="text" name="perso[tag]"/></label><br />

<label class="jsDuplicate">Nom attribut : <input type="text"  id="perso_attr" name="perso[attrName]"/></label>
<label class="jsDuplicate">Nom attribut : <input type="text"  id="perso_attr" name="perso[attrValue]"/></label><br />

<label>argsite : <input type="text" name="perso[argsite]"/></label><br />
<label>pvsite : <input type="text" name="perso[pvsite]"/></label><br />
<label>pcsite : <input type="text" name="perso[pcsite]"/></label><br />
<label>charset : <input type="text" name="perso[charset]"/></label><br />
<label>xhtml : <select name="perso[xhtml]"><option value="1">Oui</option><option value="0">Non</option></select></label> <br />
<label>debug : <select name="perso[debug]"><option value="1">Oui</option><option value="0">Non</option></select></label><br />
<input type="submit" value="Creer tableau d'option" />
<script type="text/javascript">
$(document).ready(function () {
//	var t = new nDuplicate('jsDuplicate', 'a.png', 's.png', 'r.png', '', '1', '', '');
});

</script>
</body>
</html>
