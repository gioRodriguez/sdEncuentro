package com.illyum.guia.encuentro.reads.read;

import static org.junit.Assert.assertEquals;

import org.junit.Test;

import com.illyum.guia.encuentro.reads.reader.GuiaEncuentroReaderImpl;

public class GuiaEncuentroReadTest {

	@Test
	public void toHtml() throws Exception {
		// arrange
		String expected = "<p class='readHeader'>"
				+ "<ul>"
				+ "<li>Lectura Del Año Bíblico Del Plan Encuentro I</li>"
				+ "<li>1 De Abril</li><li>Lucas 4:31:44</li>"
				+ "<li>Deseado De Todas Las Gentes, Pag. 217-218</li>"
				+ "<li>Lucas 4:31-44</li>"
				+ "</ul>"
				+ "</p>"
				+ "<hr>"
				+ "Reina-Valera 1960 (RVR1960)Un hombre que tenía un espíritu inmundo(Mr. 1.21-28)31 Descendió Jesús a Capernaum, ciudad de Galilea; y les enseñaba en los días de reposo.[a]";
		
		GuiaEncuentroReaderImpl guiaEncuentroReader = new GuiaEncuentroReaderImpl();
		GuiaEncuentroRead guiaEncuentroRead = new GuiaEncuentroRead(guiaEncuentroReader);
		guiaEncuentroRead.setReadPath("guiaEncuentroReadII.txt");
		
		// act
		String actual = guiaEncuentroRead.toHtml();
		
		// assert
		assertEquals(expected, actual);
	} 

}
