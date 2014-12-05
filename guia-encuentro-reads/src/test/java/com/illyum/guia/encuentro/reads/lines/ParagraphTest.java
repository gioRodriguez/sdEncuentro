package com.illyum.guia.encuentro.reads.lines;

import static org.junit.Assert.*;

import org.junit.Test;

public class ParagraphTest {

	@Test
	public void toHtml() throws Exception{
		// arrange
		String expected = "<p class='paragraph'><span>line one</span><span>line two</span><span>line three</span></p>";
		Paragraph paragraph = Paragraph.create();
		paragraph.addLine("line one");
		paragraph.addLine("line two");
		paragraph.addLine("line three");
		
		// act
		String actual = paragraph.toHtml();
		
		// assert
		assertEquals(expected, actual);
	}
}
