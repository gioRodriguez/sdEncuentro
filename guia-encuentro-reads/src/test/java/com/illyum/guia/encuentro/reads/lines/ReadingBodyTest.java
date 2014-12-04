package com.illyum.guia.encuentro.reads.lines;

import static org.junit.Assert.*;

import org.junit.Test;

public class ReadingBodyTest {

	@Test
	public void toHtmlWithEmpty() throws Exception {
		// arrange
		String expected = "<div class='readBoby'></div>";
		ReadingBody readingBody = ReadingBody.create();
		
		// act
		String actual = readingBody.toHtml();
		
		// assert
		assertEquals(expected, actual);
	}
	
	@Test
	public void toHtmlWithLines() throws Exception {
		// arrange
		String expected = "<div class='readBoby'><p>line one</p><p>line two</p></div>";
		ReadingBody readingBody = ReadingBody.create();
		readingBody.addEntry(EntryLine.createWithContent("line one"));
		readingBody.addEntry(EntryLine.createWithContent("line two"));
		
		// act
		String actual = readingBody.toHtml();
		
		// assert
		assertEquals(expected, actual);
	}
	
	@Test
	public void toHtmlWithParagraph() throws Exception {
		// arrange
		String expected = "<div class='readBoby'><p class='paragraph'></p></div>";
		ReadingBody readingBody = ReadingBody.create();
		Paragraph paragraph = Paragraph.create();
		readingBody.addEntry(paragraph);
		
		// act
		String actual = readingBody.toHtml();
		
		// assert
		assertEquals(expected, actual);
	}
	
	@Test
	public void toHtmlWithParagraphAndLines() throws Exception {
		// arrange
		String expected = "<div class='readBoby'><p class='paragraph'><p>line one</p></p><p>line two</p></div>";
		ReadingBody readingBody = ReadingBody.create();
		Paragraph paragraph = Paragraph.create();
		paragraph.addEntry(EntryLine.createWithContent("line one"));
		readingBody.addEntry(paragraph);
		readingBody.addEntry(EntryLine.createWithContent("line two"));
		
		// act
		String actual = readingBody.toHtml();
		
		// assert
		assertEquals(expected, actual);
	}
}
