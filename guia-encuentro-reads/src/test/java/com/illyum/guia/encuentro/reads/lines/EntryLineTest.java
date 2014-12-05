package com.illyum.guia.encuentro.reads.lines;

import static org.junit.Assert.*;

import org.junit.Test;

public class EntryLineTest {

	@Test
	public void toHtml() throws Exception {
		// arrange
		String expected = "<span>line</span>";
		
		// act
		String actual = EntryLine.createWithContent("line").toHtml();
		
		// assert
		assertEquals(expected, actual);
	}
}
