package com.illyum.guia.encuentro.reads.reader;

import static org.junit.Assert.*;

import java.util.Arrays;
import java.util.List;

import org.junit.Test;

import com.illyum.guia.encuentro.reads.lines.Line;

public class ReadsReaderFileImplTest {

	// gets lines
	@Test
	public void getLines() throws Exception {
		// arrange
		List<Line> expected = Arrays.asList(				
				Line.headerLine("header", 0),
				Line.headerLine("header", 1),
				Line.headerLine("header", 2),
				Line.headerLine("header", 3),
				Line.bodyLine("body", 4));
		
		ReadsReaderFileImpl guiaEncuentroReaderImpl = new ReadsReaderFileImpl();
		
		// act
		List<Line> actual = guiaEncuentroReaderImpl.readLines(ReadsReaderFileImpl.class.getResource("/read.txt").getPath()); 
		
		// assert
		assertArrayEquals(expected.toArray(), actual.toArray());
	}
}
