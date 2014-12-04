package com.illyum.guia.encuentro.reads.reader;

import static org.junit.Assert.*;

import java.util.Arrays;
import java.util.List;

import org.junit.Test;

import com.illyum.guia.encuentro.reads.lines.AbstractLine;

public class ReadsReaderFileImplTest {

	// gets lines
	@Test
	public void getLines() throws Exception {
		// arrange
		List<AbstractLine> expected = Arrays.asList(				
				AbstractLine.headerLine("header", 0),
				AbstractLine.headerLine("header", 1),
				AbstractLine.headerLine("header", 2),
				AbstractLine.headerLine("header", 3),
				AbstractLine.bodyLine("body", 4));
		
		ReadsReaderFileImpl guiaEncuentroReaderImpl = new ReadsReaderFileImpl();
		
		// act
		List<AbstractLine> actual = guiaEncuentroReaderImpl.readLines(ReadsReaderFileImpl.class.getResource("/read.txt").getPath()); 
		
		// assert
		assertArrayEquals(expected.toArray(), actual.toArray());
	}
}
