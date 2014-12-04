package com.illyum.guia.encuentro.reads.writer;

import org.junit.Test;

import com.illyum.guia.encuentro.reads.read.ReadsRepository;
import com.illyum.guia.encuentro.reads.read.ReadsRepositoryTest;
import com.illyum.guia.encuentro.reads.reader.ReadsReaderFileImpl;

public class ReadsWriterTest {

	@Test
	public void write() throws Exception {
		// arrange
		ReadsReaderFileImpl guiaEncuentroReader = new ReadsReaderFileImpl();
		ReadsRepository guiaEncuentroRead = new ReadsRepository(guiaEncuentroReader);
		guiaEncuentroRead.setReadPath(ReadsRepositoryTest.class.getResource("/readII.txt").getPath());
		
		ReadsWriter guiaEncuentroWriter = new ReadsWriter();
		
		// act
		guiaEncuentroWriter.write("guiaEncuentroReadFinal.txt", guiaEncuentroRead.toHtml());
		
		// assert
		
	} 

}
