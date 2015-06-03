var nDuplicate = function(classToDuplicate, srcImagePlus, srcImageMoins, srcImageRollback, max, simpleDuplicate, position, callback)
{
  var self = new Object();
  self.param = new Object();
  self.param.classToDuplicate = classToDuplicate;
  self.param.srcImagePlus = srcImagePlus;
  self.param.srcImageRollBack = srcImageRollback;
  self.param.srcImageMoins   = srcImageMoins;
  self.param.simpleDuplicate = (simpleDuplicate) ? true : false;
  self.param.duplicateMax = (typeof(max) != 'undefined') ? max : '';
  self.param.position = (position != 'left') ? 'right' :  'left';
  self.param.callback = callback;
  self.param.pattern_id = /[A-Za-z]*_[A-Za-z]*_([\d]*)/;
  self.param.pattern_name = /([A-Za-z]*_[A-Za-z]*_[\d]*_).*/;
  self.param.pattern_changeName = /[A-Za-z]*\[[A-Za-z]*\]\[([\d]*)\].*/;


  /////////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////LISTE DES FONCTIONS//////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////
  self.init = function () {
    self.addImageToDuplicableElement();
  }

  self.bindDivToggle = function ()
  {
    $('div .princ').click(function (event){
      self.toggleDiv(this);
    });
  }

  self.toggleDiv = function (elem) {
    $(elem).find('div .sec').toggle();
  }

  self.addImageToDuplicableElement = function ()
  {
    $('.'+self.param.classToDuplicate).each(function (key, elem){
      var divClass = '';
      if ($(elem).hasClass('form_ligne')){
        $(elem).removeClass('form_ligne');
        divClass = 'form_ligne';
      }
      var div = $("<div>", {
        'class': divClass+ ' relativ'
      });
      $(elem).before(div);
      if (self.param.simpleDuplicate == true && self.checkIdAndName(elem) == false) {
        self.changeElementPrincipal(elem);
      }
      var elemClone = $(elem).clone();
      $(div).append(elemClone);
      $(elemClone).css('float', 'left');
      $(elem).remove();
      self.createImgPlus(elemClone, div);
      var index = $('.'+self.param.classToDuplicate).index(this);
      if (self.param.simpleDuplicate == true && index != 0) {
        self.createImgMoins(div, true);
      }
      else {
        self.createImgMoins(div, false);
      }
    });
  }

  self.createImgPlus = function(element, divPrincipal)
  {
    var img = $('<img>', {
      src : self.param.srcImagePlus,
      css : {
        cursor: 'pointer'
      },
      'class' : 'DuplicatePlus'
    });
    var div = $("<div>", {
      /*css: {
        'float': "left"
      },*/
      'class' : 'imageDuplicate'
    });
    var clear = $("<p>", {
      'class' : 'pCleanDuplicate'
    });
    if (self.param.position == 'right') {
      $(element).after(div);
    }
    else {
      $(element).before(div);
    }
    $(div).append(img);
    $(div).after(clear);
    $(img).click({
      element : divPrincipal
    }, function (event) {
      self.duplicateElement(event.data.element);
    });
    return element;
  }

  self.reBindImg = function (element)
  {
    element.find('img[class="DuplicatePlus"]').unbind('click');
    element.find('img[class="DuplicatePlus"]').click({ element : element }, function (event) {
      self.duplicateElement(event.data.element);
    });
    element.find('img[class="DuplicateMoins"]').unbind('click');
    element.find('img[class="DuplicateMoins"]').click({ element : element }, function (event) {
      self.deleteElement(element);
    })
  }

  self.createImgMoins = function(element, deleteOrnot)
  {
    var premierElem = $(element).find('input, select, textarea').first()
    var idHidden = $(premierElem).attr('id') + 'h';
    var idElemBD = $(premierElem).attr('id');
    var cpt = idElemBD.match(self.param.pattern_id);
    cpt = cpt[1];
    if ($('#'+idHidden).length == 0 && deleteOrnot == false) {
      return false;
    }
    else if ($('#'+idHidden).length == 0 && cpt != 0) {
      deleteOrnot = true;
    }
    var img = $('<img>', {
      src : self.param.srcImageMoins,
      css : {
        cursor: 'pointer',
        'margin-left': '5px'
      },
      'class' : 'DuplicateMoins'
    });
    var divCourante = $(element).find('.'+self.param.classToDuplicate);
    var index = $('.'+self.param.classToDuplicate).index(divCourante);
    if (self.param.simpleDuplicate == false) {
      $(element).find('img[class="DuplicatePlus"]').after(img);
    }
    else if ($('.'+self.param.classToDuplicate).length > 1 && $(element).find('img[class="DuplicateMoins"]').length == 0 && index != 0) {
      $(element).find('img[class="DuplicatePlus"]').after(img);
    }
    if (deleteOrnot == true) {
      $(img).click({ element : element }, function (event){
        self.deleteElement(event.data.element);
      });
    }
    else {
      $(img).click({ element : element }, function (event){
        self.strikeElement(event.data.element);
      });
    }
  }

  self.duplicateElement = function (element)
  {
    if (self.param.duplicateMax != '' && $('.'+self.param.classToDuplicate).length >= self.param.duplicateMax) {
      return false;
    }
    var clone = $(element).clone();
    $(element).after(clone);
    self.cleanInput(clone);
    self.reBindImg(clone);
    self.changeNameInput(clone);
    if (self.param.duplicateMax != '' && $('.'+self.param.classToDuplicate).length >= self.param.duplicateMax) {
      $('img[class="DuplicatePlus"]').hide();
    }
    if (self.param.callback != '') {
      eval(self.param.callback);
    }
  }

  self.strikeElement = function (element)
  {
    var strike = $('<strike>', { 'class' : 'strikeElement' });
    var label = $('<label>', { 'class': 'labelStrike' });
    $(element).find('input, select, textarea').each(function ()
    {
      var new_strike = $(strike).clone();
      var new_label = $(label).clone();
      var id = $(this).attr('id');
      var idHidden = id + 'h'
      $(new_strike).attr('id', id+'_strike');
      $(new_label).attr('id', id+'_label');
      $(this).after(new_label);
      $(new_label).append(new_strike);
      if (this.tagName == 'SELECT') {
        $(new_strike).html($(this).find('option[value="'+$('#'+idHidden).val()+'"]').html());
      }
      else {
        $(new_strike).html($('#'+idHidden).val());
      }
      $(this).hide();
    });
    var firstInput = $(element).find('input, select, textarea').first();
    var cpt = $(firstInput).attr('id').match(self.param.pattern_name);
    self.setRollBackImg(element);
    $('#'+cpt[1]+'suppr').val('1');
  }


  self.setRollBackImg = function (element)
  {
    var img = $('<img>', {
      src : self.param.srcImageRollBack,
      css : { cursor: 'pointer' },
      'class' : 'DuplicateRollback'
    });
    $(element).find('div[class="imageDuplicate"] img').hide();
    $(element).find('div[class="imageDuplicate"]').append(img);
    $(img).click({ element : element }, function (event) {
      self.restorElement(event.data.element)
    });
  }

  self.restorElement = function (element)
  {
    $(element).find('img[class="DuplicateRollback"]').remove();
    $(element).find('div[class="imageDuplicate"] img').show();
    $(element).find('input, select, textarea').each(function ()
    {
      var id = $(this).attr('id');
      var value = $('#'+id+'h').val();
      $('#'+id+'_label').remove();
      $(this).val(value);
      $(this).show();
    });
    var firstInput = $(element).find('input, select, textarea').first();
    var cpt = $(firstInput).attr('id').match(self.param.pattern_name);
    $('#'+cpt[1]+'suppr').val('0');
  }

  self.deleteElement = function(element)
  {
    $(element).remove();
    if (self.param.duplicateMax != '' && $('.'+self.param.classToDuplicate).length < self.param.duplicateMax) {
      $('img[class="DuplicatePlus"]').show();
    }
  }

  self.cleanInput = function (element)
  {
    $(element).find('input[type="text"]').val('');
    $(element).find('input[type="hidden"]').val('');
    $(element).find('input[type="password"]').val('');
    $(element).find('input[type="radio"]').removeAttr('checked');
    $(element).find('select option').removeAttr('selected');
    $(element).find('input[type="checkbox"]').removeAttr('checked');
    $(element).find('textarea').val('');
  }

  self.checkIdAndName = function (element) {
    var ret = true;
    $(element).find('input, select, textarea').each(function () {
      var id = $(this).attr('id');
      var name = $(this).attr('name');
      if (id.match(self.param.pattern_id) == null) {
        ret = false;
      }
      if (name.match(self.param.pattern_name) == null) {
        ret =  false;
      }
    });
    return ret;
  }

  self.changeElementPrincipal = function (element) {
    $(element).find('input, select, textarea').each(function () {
      var id = $(this).attr('id');
      var name = $(this).attr('name');
      if (id.match(self.param.pattern_id) == null) {
        $(this).attr('id', id+'_0');
      }
      if (name.match(self.param.pattern_changeName) == null) {
        $(this).attr('name', name+'[0]');
      }
    });
  }

  self.changeNameInputSimple = function (clone) {
    var countMaxIncrement = 0;
    $(clone).find('input, select, textarea').each(function () {
      var id = $(this).attr('id');
      var name = $(this).attr('name');
      var cpt = id.match(self.param.pattern_id);
console.log(cpt);
      countMaxIncrement = $(document).find('#[id^="'+cpt[1]+'"]').length;
console.log(countMaxIncrement);
      cpt = name.match(self.param.pattern_changeName);
      var new_name = name.replace(cpt[1], countMaxIncrement);
console.log(new_name);
      $(this).attr('name', new_name);
      cpt = id.match(self.param.pattern_id);
console.log(cpt);
      var new_id = id.replace(cpt[2], countMaxIncrement);
      $(this).attr('id', new_id);
console.log(new_id);
    });
    self.createImgMoins(clone, true);
  }

  self.changeNameInput = function (clone)
  {
    if (self.param.simpleDuplicate == true) {
      self.changeNameInputSimple(clone);
      return true;
    }
    var countMax = 0;
    var pattern_id = /[A-Za-z]*_[A-Za-z]*_([\d]*)_.*/;
    var pattern_id_find = /([A-Za-z\d_]*)_[\d]*(_.*)/;
    $(clone).find('input, select, textarea').each(function () {
      var id_elem = $(this).attr('id');
      var cpt = id_elem.match(pattern_id_find);
      countMax = 0;
      $(document).find('#[id^="'+cpt[1]+'"][id$="'+cpt[2]+'"]').each(function ()
      {
        var name = $(this).attr('name');
        var cpt_name = name.match(self.param.pattern_changeName);
        if (parseInt(cpt_name[1]) > parseInt(countMax)){
          countMax  = parseInt(cpt_name[1]);
        }
      });
      countMax +=  1;
      var name = $(this).attr('name');
      cpt = name.match(self.param.pattern_changeName);
      var new_name = name.replace(cpt[1], countMax);
      $(this).attr('name', new_name);
      var id = $(this).attr('id');
      cpt = id.match(pattern_id);
      var new_id = id.replace(cpt[1], countMax);
      $(this).attr('id', new_id);
    });
    if ($(clone).find('.DuplicateMoins').length == 0) {
      self.createImgMoins(clone, true);
    }
  }


  self.init();
  return self;
}
