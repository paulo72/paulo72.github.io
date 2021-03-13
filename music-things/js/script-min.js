////////////////////////////////////////////////////////////////////////////////
//
//      Cookies
//
////////////////////////////////////////////////////////////////////////////////

  function createCookie(name,value,days) {
    if (days) {
      var date = new Date();
      date.setTime(date.getTime()+(days*24*60*60*1000));
      var expires = "; expires="+date.toGMTString();
    }
    else var expires = "";
    document.cookie = name+"="+value+expires+"; path=/";
  }

  function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
      var c = ca[i];
      while (c.charAt(0)==' ') c = c.substring(1,c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
  }

  function eraseCookie(name) {
    createCookie(name,"",-1);
  }

      
////////////////////////////////////////////////////////////////////////////////
//
//      Helpers
//
////////////////////////////////////////////////////////////////////////////////

  // remove substring 

    String.prototype.replaceAt = function(index, replacement) {
      return this.substr(0, index) + replacement + this.substr(index + replacement.length);
    }


////////////////////////////////////////////////////////////////////////////////
//
//      Offline
//
////////////////////////////////////////////////////////////////////////////////



  // if ("serviceWorker" in navigator) {
  //   navigator.serviceWorker.register("/service-worker.js")
  //     .then(function (registration) {
  //       console.log("Service Worker registered with scope:", 
  //       registration.scope);
  //     }).catch(function (err) {
  //     console.log("Service worker registration failed:", err);
  //   });
  // }


////////////////////////////////////////////////////////////////////////////////
//
//      updateScaleInfo ()
//
////////////////////////////////////////////////////////////////////////////////

  var intervalz;
  function updateScaleInfo() {
    //console.clear();
    var pd_scale_tonic    = $('#scale_tonic').val();
    var pd_scale_type     = $('#scale_type').val();
    var pd_scale_name     = pd_scale_tonic + ' ' + pd_scale_type;
    var pd_scale          = Tonal.Scale.get(pd_scale_name).notes;
    var pd_scale_long     = pd_scale.concat(pd_scale).concat(pd_scale).concat(pd_scale);

    // console.log('pd_scale_tonic',pd_scale_tonic);

    // console.log('pd_scale_type',pd_scale_type);
    // console.log('pd_scale_name',pd_scale_name);
    // console.log('pd_scale_long',pd_scale_long);


    $('body').attr('data-scale', pd_scale_type.replace(/\s+/g, '-').toLowerCase());

    var pd_scale_output   = '';
    var keyboardClass     = '';
    var key_to_highlight;

    var roots = []; 
    var thirds = [];
    var fifths =  [];
    var sevenths = [];
    var ninths = [];
    var elevenths = [];
    var thirteenths = [];
    var counts = [];
    var oct1 = [];
    var oct2 = [];
    var count = 0;
    var octave = 1;
    var tone = '';
    var tonic = '';

    var scale = Tonal.Scale.get(pd_scale_name).notes;
    var end = Tonal.Scale.get(pd_scale_name).notes.length;
    var listothings = [];
        listothings = listothings.concat(scale,scale,scale);
        intervalz = Tonal.Scale.get(pd_scale_name).intervals;

    $('.key, .fret')
      .attr('data-scale-highlight',null)
      .attr('data-scale-number', null)
      .attr('data-scale-highlight-tonic',null)
      .attr('data-scale-interval',null)
    ; 
    console.log('pd_scale',pd_scale);
    pd_scale.forEach( function (item, index) {

      keyboardClass = item;

      if (keyboardClass.charAt(1) == 'b') {
        keyboardClass = keyboardClass.replaceAt(1, "-flat");
      } else if (keyboardClass.charAt(1) == '#') {
        keyboardClass = keyboardClass.replaceAt(1, "-sharp");
      }

      fretboardClass = "fret-" + keyboardClass;
      keyboardClass = "key-" + keyboardClass;
      // console.log('fretboardClass',fretboardClass);


      key_to_highlight = $('.' + keyboardClass);
      fret_to_highlight = $('.' + fretboardClass);

      key_to_highlight.addClass('data-scale-number'+(index+1));

      key_to_highlight.attr('data-scale-highlight','1').attr('data-scale-number', index+1 ).attr('data-scale-interval', intervalz[index] );
      if (index === 0) {
        key_to_highlight.attr('data-scale-highlight-tonic','1');
      }


      fret_to_highlight.attr('data-scale-highlight','1').attr('data-scale-number', index+1 ).attr('data-scale-interval', intervalz[index] ).attr('data-note-display', item.replace("#", "♯").replace("b", "♭") );
      if (index === 0) {
        fret_to_highlight.attr('data-scale-highlight-tonic','1');
      }

      // console.log('fret_to_highlight',fret_to_highlight);


      pd_scale_output += '<span class="scale-tone scale-tone--'+ (index + 1) +'" data-scale-interval="'+intervalz[index] +'">' + item + '</span>';
    });


    $('#name-of-scale').text(pd_scale_name);     
    $('#scale_notes').html(pd_scale_output);


    var starts_above_c = false;
    var starts_below_c = false;
    var starts_over_c_passed_below_c = false;
    var below_c = ['Ab','A','A#','Bb','B','B#'];
    var is_c = ['C','C#'];

    while (count < end) {

      thirteenths.push(listothings[count + 12]);
      elevenths.push(listothings[count + 10]);
      ninths.push(listothings[count + 8]);
      sevenths.push(listothings[count + 6]);
      fifths.push(listothings[count + 4]);
      thirds.push(listothings[count + 2]); 
      roots.push(listothings[count + 0]);

      tone = Tonal.Scale.get(pd_scale_name).notes[count];

      

      if (count === 0) {
        tonic = tone;
        if( below_c.includes(tone) ) {
          octave = 0;
        } else  {
          octave = 1;
        }
      } else if  ( is_c.includes(tone) ) {
        octave = octave + 1;
      }

      console.log('tone',tone + octave);

      oct1_val = Math.round( Tonal.Note.freq( tone + octave ) );
      oct2_val = Math.round( Tonal.Note.freq( tone + (1 + octave) ) );

      oct1.push(oct1_val);
      oct2.push(oct2_val);

      counts += count + 1;

      count++;
    }


    count = 0;
    var thirteenths_string = ''
    while (count < end) { thirteenths_string += '<td class="chords " data-enharmonic="'+ (thirteenths[count].length - 1) +'">' + thirteenths[count].replace("#", "♯").replace("b", "♭") + '</td>'; count++; }

    count = 0;
    var elevenths_string = ''
    while (count < end) { elevenths_string  += '<td class="chords " data-enharmonic="'+ (elevenths[count].length - 1) +'">' + elevenths[count].replace("#", "♯").replace("b", "♭") + '</td>'; count++; }

    count = 0;
    var ninths_string = ''
    while (count < end) { ninths_string += '<td class="chords " data-enharmonic="'+ (ninths[count].length - 1) +'">' + ninths[count].replace("#", "♯").replace("b", "♭") + '</td>'; count++; }

    count = 0;
    var sevenths_string = ''
    while (count < end) { sevenths_string += '<td class="chords " data-enharmonic="'+ (sevenths[count].length - 1) +'">' + sevenths[count].replace("#", "♯").replace("b", "♭") + '</td>'; count++; }

    count = 0;
    var fifths_string = ''
    while (count < end) { 
      fifths_string += '<td class="chords" data-enharmonic="'+ (fifths[count].length - 1) +'">' + fifths[count].replace("#", "♯").replace("b", "♭") + '</td>'; count++; }

    count = 0;
    var thirds_string = ''
    while (count < end) { thirds_string += '<td class="chords" data-enharmonic="'+ (thirds[count].length - 1) +'">' + thirds[count].replace("#", "♯").replace("b", "♭") + '</td>'; count++; }


    count = 0;
    var roots_string = ''
    while (count < end) { roots_string += '<td data-note="'+roots[count]+3+'" class="chords bold scale-tone scale-tone--' + (count + 1) +'" data-scale-interval="'+intervalz[count]+'">' + roots[count].replace("#", "♯").replace("b", "♭") + '</td>'; count++; }

    count = 0;
    var count_string = ''
    count = 1;
    while (count < end + 1 ) { 
      var the1 = pd_scale_long[count-1];
      var the3 = pd_scale_long[count+1];
      var the5 = pd_scale_long[count+3];
      var the7 = pd_scale_long[count+5];
      var theC = Tonal.Chord.detect([the1,the3,the5,the7]) + ' ';
      if (theC.includes(',')){
        theC = theC.substring( 0, theC.indexOf(","));
      }
      count_string += '<td class="chord_number_'+count+' ">' + intervalz[count-1] + '<div class="info">' + theC + '</div></td>'; 
      count++; 
    }

    count = 0;
    var sub_string = ''
    while (count < end) { 
      sub_string += '<td class="chords info">' + oct1[count] + '</td>'; count++; }

    count = 0;
    var bass_string = ''
    while (count < end) { bass_string += '<td class="chords info">' + oct2[count] + '</td>'; count++; }


    var scale_chords_table =  '<table id="the_chords"><tbody>';
        scale_chords_table += '<tr class="chords_13th"><td>13th</td>' + thirteenths_string + '</tr>';
        scale_chords_table += '<tr class="chords_11th"><td>11th</td>' + elevenths_string + '</tr>';
        scale_chords_table += '<tr class="chords_9th"><td>9th</td>'   + ninths_string + '</tr>';
        scale_chords_table += '<tr class="chords_7th"><td>7th</td>'   + sevenths_string + '</tr>';
        scale_chords_table += '<tr class="chords_5th"><td>5th</td>'   + fifths_string + '</tr>';
        scale_chords_table += '<tr class="chords_3rd"><td>3rd</td>'   + thirds_string + '</tr>';
        scale_chords_table += '<tr class="chords_1st"><td>Root</td>'  + roots_string + '</tr>';
        scale_chords_table += '<tr class="chord-numbers "><td>&nbsp;</td>' + count_string + '</tr>';
        scale_chords_table += '<tr class=""><td class="info">Sub Hz</td>'          + sub_string + '</tr>';
        scale_chords_table += '<tr class=""><td class="info">Bass Hz</td>'          + bass_string + '</tr>';
        scale_chords_table += '</tbody></table>';

    $('#scale_chords').html(scale_chords_table);


  }

////////////////////////////////////////// //////////////////////////////////////
//
//      updateBPM ()
//
////////////////////////////////////////////////////////////////////////////////
  function updateBPM() {
    var pd_bpm    = $('#bpm').val();
    var min       = 60000;
    var delay_1    = (min/pd_bpm*4).toFixed(2) + 'ms';
    var delay_2    = (min/pd_bpm*1).toFixed(2) + 'ms';
    var delay_4    = (min/pd_bpm*1).toFixed(2) + 'ms';
    var delay_8dot = (min/pd_bpm*0.75).toFixed(2) + 'ms';
    var delay_8    = (min/pd_bpm*0.5).toFixed(2) + 'ms';
    var delay_16   = (min/pd_bpm*0.25).toFixed(2) + 'ms';
    $('#delay_1').text(delay_1);
    $('#delay_2').text(delay_2);
    $('#delay_4').text(delay_4);
    $('#delay_8dot').text(delay_8dot);
    $('#delay_8').text(delay_8);
    $('#delay_16').text(delay_16);

    $('#reverb_pre_delay_h').text( (min/pd_bpm*0.125).toFixed(2) + 'ms');
    $('#reverb_pre_delay_lr').text((min/pd_bpm*0.0625).toFixed(2) + 'ms');
    $('#reverb_pre_delay_sr').text((min/pd_bpm*0.03125).toFixed(2) + 'ms');
    $('#reverb_pre_delay_ta').text((min/pd_bpm*0.015625).toFixed(2) + 'ms');

    $('#reverb_decay_h').text(  63 * (min/pd_bpm*0.125).toFixed(2) + 'ms');
    $('#reverb_decay_lr').text( 63 * (min/pd_bpm*0.0625).toFixed(2) + 'ms');
    $('#reverb_decay_sr').text( 63 * (min/pd_bpm*0.03125).toFixed(2) + 'ms');
    $('#reverb_decay_ta').text( 63 * (min/pd_bpm*0.015625).toFixed(2) + 'ms');

  }

////////////////////////////////////////////////////////////////////////////////
//
//      updateChordInfo ()
//
////////////////////////////////////////////////////////////////////////////////
  function updateChordInfo(){
    var pd_chord_type = $('#chord_types').val();
    $('body').attr("data-chord-type", pd_chord_type);
  }

////////////////////////////////////////////////////////////////////////////////
//
//      initAudioBits ()
//
////////////////////////////////////////////////////////////////////////////////
  function initAudioBits(){
    const dist = new Tone.Distortion(0.4).toDestination();
    const synth = new Tone.Synth().connect(dist);
    synth.oscillator.type = "triangle";

    // const synth = new Tone.PolySynth(
    //   Tone.Synth, {
    //     oscillator : {
    //       type : "triangle"
    //     },
    //     // envelope: {
    //     //   attack: 0.1,
    //     //   decay: 0.20,
    //     //   sustain: 0.15,
    //     //   release: 0.03,
    //     // },
    //   }
    // ).connect(dist).toDestination();

    $(document).on('pointerdown','[data-note]', function(e) { 
      console.log('this pointerdown',this);
      synth.triggerAttack(e.target.dataset.note);
    });
    $(document).on('pointerup','[data-note]', function(e) { 
      console.log('this pointerup',this);
      synth.triggerRelease();
    });


    // instruments.addEventListener("pointerdown", e => {
    //   console.log('this', this);
    //   synth.triggerAttack(e.target.dataset.note);
    // });

    // instruments.addEventListener("pointerup", e => {
    //   console.log('pointerup')
    //   synth.triggerRelease();
    // });
  }





////////////////////////////////////////////////////////////////////////////////
//
//      generateRandomName ()
//
////////////////////////////////////////////////////////////////////////////////

  function generateRandomName(){
    var random1 = random1Array[Math.floor(Math.random()*random1Array.length)];
    var random2 = random2Array[Math.floor(Math.random()*random2Array.length)];
    var randomIshName = random1 + ' ' + random2;
    $('#song_name').val(randomIshName);
    createCookie('songName',randomIshName,7);
  }

  function newRandomishName(){
    eraseCookie('songName');
    generateRandomName();
  }


////////////////////////////////////////////////////////////////////////////////
//
//      DOM Ready
//
////////////////////////////////////////////////////////////////////////////////

  $(function() {

    var cookieSongName  = readCookie('songName');
    var cookieSongNote  = readCookie('songNote');
    var cookieSongScale = readCookie('songScale');
    var cookieSongBPM   = readCookie('songBPM');

    console.log(cookieSongName);
    console.log(cookieSongNote);
    console.log(cookieSongScale);
    console.log(cookieSongBPM);


    if (cookieSongNote) {
      $('#scale_tonic').val(cookieSongNote);
    }
    if (cookieSongScale) {
      $('#scale_type').val(cookieSongScale);
    } 
    if (cookieSongBPM) {
      $('#bpm').val(cookieSongBPM);
    }
    if (cookieSongName) {
      $('#song_name').val(cookieSongName);
    } else {
      generateRandomName();
    }

    updateScaleInfo();
    $('#scale_tonic').on('change', function() { 
      updateScaleInfo(); 
      createCookie('songNote', $('#scale_tonic').val() ,7);
    });
    $('#scale_type').on('change', function() { 
      updateScaleInfo(); 
      createCookie('songScale', $('#scale_type').val(),7);
    });

    updateBPM();
    $('#bpm').on('change', function() { 
      updateBPM(); 
      createCookie('songBPM', $('#bpm').val(),7);
    });

    $('#song_name').on('change', function() { 
      createCookie('songName', $('#song_name').val(),7);
    });


    $('#note_display').on('change', function() { 
      $('body').attr('data-note-display',$('#note_display').val());
      createCookie('noteDisplay', $('#note_display').val(),7);
    });

    updateChordInfo();
    $('#chord_types').on('change', function() { 
      updateChordInfo(); 
    });

    $('#instrument').on('change', function() {
      $('#fretboard,#keyboard').show();
      if ($('#instrument').val() == "bass") { $('#keyboard').hide(); } 
      else if ($('#instrument').val() == "keyboard") { $('#fretboard').hide(); }
    });

    initAudioBits();

  }); // ready