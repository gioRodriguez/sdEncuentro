package com.illyum.guia.encuentro.reads.lines;

import static org.junit.Assert.*;

import org.junit.Test;

public class ParagraphTest {

	@Test
	public void toHtml() throws Exception{
		// arrange
		String expected = "<p class='paragraph'><p>line one</p><p>line two</p><p>line three</p></p>";
		Paragraph paragraph = Paragraph.create();
		paragraph.addEntry(EntryLine.createWithContent("line one"));
		paragraph.addEntry(EntryLine.createWithContent("line two"));
		paragraph.addEntry(EntryLine.createWithContent("line three"));
		
		// act
		String actual = paragraph.toHtml();
		
		// assert
		assertEquals(expected, actual);
	}
}
