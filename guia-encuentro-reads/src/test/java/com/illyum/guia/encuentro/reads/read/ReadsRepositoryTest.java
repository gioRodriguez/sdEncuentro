package com.illyum.guia.encuentro.reads.read;

import static org.junit.Assert.assertEquals;

import org.junit.Test;

import com.illyum.guia.encuentro.reads.reader.ReadsReaderFileImpl;

public class ReadsRepositoryTest {

	@Test
	public void toHtml() throws Exception {
		// arrange
		String expected = "<div class='readHeader'><ul><li><span></span><h1>Lectura del Año Bíblico del Plan Encuentro I</h1></li><li><span></span><h2>22 de Mayo</h2></li><li><span></span><h3>Mateo 9:18-31; Marcos 5:21-43.</h3></li></ul></div><hr><div class='readBoby'><p class='paragraph'><span>Mateo 9:18-31</span></p><p class='paragraph'><span>Reina-Valera 1960 (RVR1960)</span></p><p class='paragraph'><span>La hija de Jairo, y la mujer que tocó el manto de Jesús</span></p><p class='paragraph'><span>(Mr. 5.21-43; Lc. 8.40-56)</span></p><p><br><br></p></div>";
		
		ReadsReaderFileImpl guiaEncuentroReader = new ReadsReaderFileImpl();
		ReadsRepository guiaEncuentroRead = new ReadsRepository(guiaEncuentroReader);
		guiaEncuentroRead.setReadPath(ReadsRepositoryTest.class.getResource("/readII.txt").getPath());
		
		// act
		String actual = guiaEncuentroRead.toHtml();
		
		// assert
		assertEquals(expected, actual);
	} 

}
