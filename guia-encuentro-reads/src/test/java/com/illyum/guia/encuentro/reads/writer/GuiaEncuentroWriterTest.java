package com.illyum.guia.encuentro.reads.writer;

import org.junit.Test;

import com.illyum.guia.encuentro.reads.read.GuiaEncuentroRead;
import com.illyum.guia.encuentro.reads.read.GuiaEncuentroReadTest;
import com.illyum.guia.encuentro.reads.reader.GuiaEncuentroReaderImpl;

public class GuiaEncuentroWriterTest {

	@Test
	public void write() throws Exception {
		// arrange
		GuiaEncuentroReaderImpl guiaEncuentroReader = new GuiaEncuentroReaderImpl();
		GuiaEncuentroRead guiaEncuentroRead = new GuiaEncuentroRead(guiaEncuentroReader);
		guiaEncuentroRead.setReadPath(GuiaEncuentroReadTest.class.getResource("/guiaEncuentroReadII.txt").getPath());
		
		GuiaEncuentroWriter guiaEncuentroWriter = new GuiaEncuentroWriter();
		
		// act
		guiaEncuentroWriter.write("guiaEncuentroReadFinal.txt", guiaEncuentroRead.toHtml());
		
		// assert
		
	} 

}
