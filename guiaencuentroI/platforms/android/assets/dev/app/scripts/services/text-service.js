/**
 * services for interact with the data layer
 */
(function() {
  'use strict';
  
  var cachedText = null;

  var textService = function(localStorageService) {
    var textServiceFactory = {};

    /**
     * selectedDate format 'yyyy-MMMM-dd'
     */
    textServiceFactory.getTextByDate = function(selectedDate) {
      var textDeferred = $.Deferred();

      if (selectedDate) {
        if (getCachedText(selectedDate)) {
          textDeferred.resolve(getCachedText(selectedDate).text);
        } else {
            // for debuging purposes
//          window.getText = function(data, fn){
//            return fn('<div class="readHeader"><ul><li><span></span><h1>﻿Lectura del Año Bíblico del Plan Encuentro III</h1></li><li><span></span><h2>1 de Abril</h2></li><li><span></span><h3>Éxodo 4:1-26; Patriarcas Y Profetas, Páginas 246-247.</h3></li></ul></div><hr><div class="readBoby"><p>Éxodo</p><p>Capítulo 04</p><p>4:1 Entonces Moisés respondió diciendo: He aquí que ellos no me creerán, ni oirán mi voz; porque dirán: No te ha aparecido Jehová. </p><p>4:2 Y Jehová dijo: ¿Qué es eso que tienes en tu mano? Y él respondió: Una vara. </p><p>4:3 El le dijo: Echala en tierra. Y él la echó en tierra, y se hizo una culebra; y Moisés huía de ella. </p><p>4:4 Entonces dijo Jehová a Moisés: Extiende tu mano, y tómala por la cola. Y él extendió su mano, y la tomó, y se volvió vara en su mano. </p><p>4:5 Por esto creerán que se te ha aparecido Jehová, el Dios de tus padres, el Dios de Abraham, Dios de Isaac y Dios de Jacob. </p><p>4:6 Le dijo además Jehová: Mete ahora tu mano en tu seno. Y él metió la mano en su seno; y cuando la sacó, he aquí que su mano estaba leprosa como la nieve. </p><p>4:7 Y dijo: Vuelve a meter tu mano en tu seno. Y él volvió a meter su mano en su seno; y al sacarla de nuevo del seno, he aquí que se había vuelto como la otra carne. </p><p>4:8 Si aconteciere que no te creyeren ni obedecieren a la voz de la primera señal, creerán a la voz de la postrera. </p><p>4:9 Y si aún no creyeren a estas dos señales, ni oyeren tu voz, tomarás de las aguas del río y las derramarás en tierra; y se cambiarán aquellas aguas que tomarás del río y se harán sangre en la tierra. </p><p>4:10 Entonces dijo Moisés a Jehová: ¡Ay, Señor! nunca he sido hombre de fácil palabra, ni antes, ni desde que tú hablas a tu siervo; porque soy tardo en el habla y torpe de lengua. </p><p>4:11 Y Jehová le respondió: ¿Quién dio la boca al hombre? ¿o quién hizo al mudo y al sordo, al que ve y al ciego? ¿No soy yo Jehová? </p><p>4:12 Ahora pues, ve, y yo estaré con tu boca, y te enseñaré lo que hayas de hablar. </p><p>4:13 Y él dijo: ¡Ay, Señor! envía, te ruego, por medio del que debes enviar. </p><p>4:14 Entonces Jehová se enojó contra Moisés, y dijo: ¿No conozco yo a tu hermano Aarón, levita, y que él habla bien? Y he aquí que él saldrá a recibirte, y al verte se alegrará en su corazón. </p><p>4:15 Tú hablarás a él, y pondrás en su boca las palabras, y yo estaré con tu boca y con la suya, y os enseñaré lo que hayáis de hacer. </p><p>4:16 Y él hablará por ti al pueblo; él te será a ti en lugar de boca, y tú serás para él en lugar de Dios. </p><p>4:17 Y tomarás en tu mano esta vara, con la cual harás las señales.</p><p>4:18 Así se fue Moisés, y volviendo a su suegro Jetro, le dijo: Iré ahora, y volveré a mis hermanos que están en Egipto, para ver si aún viven. Y Jetro dijo a Moisés: Ve en paz. </p><p>4:19 Dijo también Jehová a Moisés en Madián: Ve y vuélvete a Egipto, porque han muerto todos los que procuraban tu muerte. </p><p>4:20 Entonces Moisés tomó su mujer y sus hijos, y los puso sobre un asno, y volvió a tierra de Egipto. Tomó también Moisés la vara de Dios en su mano. </p><p>4:21 Y dijo Jehová a Moisés: Cuando hayas vuelto a Egipto, mira que hagas delante de Faraón todas las maravillas que he puesto en tu mano; pero yo endureceré su corazón, de modo que no dejará ir al pueblo. </p><p>4:22 Y dirás a Faraón: Jehová ha dicho así: Israel es mi hijo, mi primogénito. </p><p>4:23 Ya te he dicho que dejes ir a mi hijo, para que me sirva, mas no has querido dejarlo ir; he aquí yo voy a matar a tu hijo, tu primogénito. </p><p>4:24 Y aconteció en el camino, que en una posada Jehová le salió al encuentro, y quiso matarlo. </p><p>4:25 Entonces Séfora tomó un pedernal afilado y cortó el prepucio de su hijo, y lo echó a sus pies, diciendo: A la verdad tú me eres un esposo de sangre. </p><p>4:26 Así le dejó luego ir. Y ella dijo: Esposo de sangre, a causa de la circuncisión. </p><p>CAPÍTULO 22. Moisés</p><p>PARA proveerse de alimentos durante el tiempo de hambre, el pueblo egipcio había vendido a la corona su ganado y sus tierras, y finalmente se habían comprometido a una servidumbre perpetua. Pero José proveyó sabiamente para su liberación; les permitió que fuesen arrendatarios del rey, quien seguía conservando las tierras y a quien le pagaban un tributo anual cae un quinto de los productos de su trabajo.</p><p>Pero los hijos de Jacob no necesitaban someterse a tales condiciones. A causa de los servicios que José había prestado a la nación egipcia, no solamente se les otorgó una parte del país para que moraran allí, sino que fueron exonerados del pago de impuestos, y se les proveyó liberalmente de los alimentos necesarios mientras duró el hambre. El rey reconoció públicamente que gracias a la misericordiosa intervención del Dios de José, Egipto gozaba de abundancia mientras otras naciones estaban pereciendo de hambre. Vio también que la administración de José había enriquecido grandemente el reino, y su gratitud rodeó a la familia de Jacob con el favor real.</p><p>Pero con el correr del tiempo, el gran hombre a quien Egipto debía tanto, y la generación bendecida por su obra, descendieron al sepulcro. Y "levantóse entretanto un nuevo rey sobre Egipto, que no conocía a José." (Véase Éxodo 1-4.) No era que ignorase los servicios prestados por José a la nación; pero no quiso reconocerlos, y hasta donde le fue posible, trató de enterrarlos en el olvido. "El cual dijo a su pueblo: He aquí, el pueblo de los hijos de Israel es mayor y más fuerte que nosotros: ahora, pues, seamos sabios para con porque no se multiplique, y acontezca que viniendo guerra, él también se junte con nuestros enemigos, y pelee contra nosotros, y se vaya de la tierra."</p><p>Los israelitas se habían hecho ya muy numerosos. "Crecieron, y multiplicaron, y fueron aumentados y corroborados en extremo; y llenóse la tierra de ellos." Gracias al cuidado protector de José y al favor del rey que gobernaba en aquel entonces, se habían diseminado rápidamente por el país. Pero se habían mantenido como una raza distinta. sin tener nada en común con los egipcios en sus costumbres o en su religión: y su número creciente excitaba el recelo del rey y su pueblo, pues temían que en caso de guerra se uniesen con los enemigos de Egipto. Sin embargo, las leyes prohibían que fueran expulsados del país. Muchos de ellos eran obreros capacitados y entendidos, y contribuían grandemente a la riqueza de la nación; el rey los necesitaba para la construcción de sus magníficos palacios y templos. Por lo tanto, los equiparé con los egipcios que se habían vendido con sus posesiones al reino. Poco después puso sobre ellos "comisarios de tributos" y completó su esclavitud. "Y los Egipcios hicieron servir a los hijos de Israel con dureza: y amargaron su vida con dura servidumbre, en hacer barro y ladrillo, y en toda labor del campo, y en todo su servicio, al cual los obligaban con rigorismo." "Empero cuanto más los oprimían. tanto más se multiplicaban y crecían."</p><p>El rey y sus consejeros habían esperado someter a los israelitas mediante trabajos arduos, y de esa manera disminuir su número y sofocar su espíritu independiente. Al fracasar en el logro, de sus propósitos, usaron medidas mucho más crueles. Se ordenó a las mujeres cuya profesión les daba la oportunidad de hacerlo, que dieran muerte a los niños varones hebreos en el momento de nacer. Satanás fue el instigador de este plan, Sabía que entre los israelitas había de levantarse un libertador; y al inducir al rey a destruir a los niños varones, esperaba derrotar el propósito divino. Pero esas mujeres temían a Dios, y no osaron cumplir tan cruel mandato. </p><p><br><br></p></div>');
//          }
          window.getText(selectedDate, function(data) {
            setCachedText(selectedDate, data);

            textDeferred.resolve(data);
          });
        }
      } else {
        textDeferred.reject();
      }

      return textDeferred.promise();
    };

    function getCachedText(selectedDate) {
      return getTextFromMemory(selectedDate) ||
        getTextFromStorage(selectedDate);
    }

    function getTextFromMemory(selectedDate) {
      if (cachedText &&
        cachedText.selectedDate === selectedDate) {
        return cachedText;
      } else {
        return null;
      }
    }

    function getTextFromStorage(selectedDate) {
      cachedText = localStorageService.get('text');
      return getTextFromMemory(selectedDate);
    }

    function setCachedText(selectedDate, data) {
      cachedText = {
        'selectedDate' : selectedDate,
        'text' : data
      };
      
      localStorageService.set('text', cachedText);
    }
    return textServiceFactory;
  };

  angular.module('guiaEncuentroApp').factory('textService', [
    'localStorageService',
    textService
  ]);
})();