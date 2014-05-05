package com.illyum.guia.encuentro.reads.read;

import static org.junit.Assert.assertEquals;

import org.junit.Test;

import com.illyum.guia.encuentro.reads.reader.GuiaEncuentroReaderImpl;

public class GuiaEncuentroReadTest {

	@Test
	public void toHtml() throws Exception {
		// arrange
		String expected = "<div class='readHeader'><ul><li><span></span><h1>Lectura Del Año Bíblico Del Plan Encuentro I</h1></li><li><span></span><h2>22 De Mayo</h2></li><li><span></span><h3>Mateo 9:18-31; Marcos 5:21-43.</h3></li></ul></div><hr><div class='readBoby'><p>Mateo 9:18-31</p><p>Reina-Valera 1960 (RVR1960)</p><p>La hija de Jairo, y la mujer que tocó el manto de Jesús</p><p>(Mr. 5.21-43; Lc. 8.40-56)</p></div>";
		
		GuiaEncuentroReaderImpl guiaEncuentroReader = new GuiaEncuentroReaderImpl();
		GuiaEncuentroRead guiaEncuentroRead = new GuiaEncuentroRead(guiaEncuentroReader);
		guiaEncuentroRead.setReadPath(GuiaEncuentroReadTest.class.getResource("/guiaEncuentroReadII.txt").getPath());
		
		// act
		String actual = guiaEncuentroRead.toHtml();
		
		// assert
		assertEquals(expected, actual);
	} 

}
