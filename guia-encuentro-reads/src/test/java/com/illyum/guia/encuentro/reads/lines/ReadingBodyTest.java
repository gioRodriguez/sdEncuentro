package com.illyum.guia.encuentro.reads.lines;

import static org.junit.Assert.*;

import org.junit.Test;

public class ReadingBodyTest {

	@Test
	public void toHtmlWithEmpty() throws Exception {
		// arrange
		String expected = "<div class='readBoby'><p><br><br></p></div>";
		ReadingBody readingBody = ReadingBody.create();
		
		// act
		String actual = readingBody.toHtml();
		
		// assert
		assertEquals(expected, actual);
	}
	
	@Test
	public void toHtmlWithLines() throws Exception {
		// arrange
		String expected = "<div class='readBoby'><p class='paragraph'><span>line one</span></p><p class='paragraph'><span>line two</span></p><p><br><br></p></div>";
		ReadingBody readingBody = ReadingBody.create();
		readingBody.addLine("line one");
		readingBody.addLine("line two");
		
		// act
		String actual = readingBody.toHtml();
		
		// assert
		assertEquals(expected, actual);
	}
	
	@Test
	public void toHtmlWithParagraph() throws Exception {
		// arrange
		String expected = "<div class='readBoby'><p class='paragraph'></p><p><br><br></p></div>";
		ReadingBody readingBody = ReadingBody.create();
		Paragraph paragraph = Paragraph.create();
		readingBody.addParagraph(paragraph);
		
		// act
		String actual = readingBody.toHtml();
		
		// assert
		assertEquals(expected, actual);
	}
	
	@Test
	public void toHtmlWithParagraphAndLines() throws Exception {
		// arrange
		String expected = "<div class='readBoby'><p class='paragraph'><span>line one</span></p><p class='paragraph'><span>line two</span></p><p><br><br></p></div>";
		ReadingBody readingBody = ReadingBody.create();
		Paragraph paragraph = Paragraph.create();
		paragraph.addLine("line one");
		readingBody.addParagraph(paragraph);
		readingBody.addLine("line two");
		
		// act
		String actual = readingBody.toHtml();
		
		// assert
		assertEquals(expected, actual);
	}
}
