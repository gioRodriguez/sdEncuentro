package com.illyum.guia.encuentro.reads.reader;

import static org.junit.Assert.*;

import java.util.Arrays;
import java.util.List;

import org.junit.Test;

import com.illyum.guia.encuentro.reads.lines.GuiaEncuentroLine;

public class GuiaEncuentroReaderImplTest {

	// gets lines
	@Test
	public void getLines() throws Exception {
		// arrange
		List<GuiaEncuentroLine> expected = Arrays.asList(				
				GuiaEncuentroLine.headerLine("header", 0),
				GuiaEncuentroLine.headerLine("header", 1),
				GuiaEncuentroLine.headerLine("header", 2),
				GuiaEncuentroLine.headerLine("header", 3),
				GuiaEncuentroLine.bodyLine("body", 4));
		
		GuiaEncuentroReaderImpl guiaEncuentroReaderImpl = new GuiaEncuentroReaderImpl();
		
		// act
		List<GuiaEncuentroLine> actual = guiaEncuentroReaderImpl.readLines(GuiaEncuentroReaderImpl.class.getResource("/guiaEncuentroRead.txt").getPath()); 
		
		// assert
		assertArrayEquals(expected.toArray(), actual.toArray());
	} 
}
