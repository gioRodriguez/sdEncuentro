package com.illyum.guia.encuentro.reads.lines;

import static org.junit.Assert.assertEquals;

import org.junit.Test;

public class BottomEntryTest {
	
	@Test
	public void toHtml() throws Exception {
		// arrange
		String expected = "<p><br><br></p>";
		
		// act
		String actual = BottomEntry.create().toHtml();
		
		// assert
		assertEquals(expected, actual);
	}
}
