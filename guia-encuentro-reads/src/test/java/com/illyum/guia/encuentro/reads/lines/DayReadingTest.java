package com.illyum.guia.encuentro.reads.lines;

import static org.junit.Assert.*;

import org.junit.Test;

public class DayReadingTest {

	@Test
	public void toHtmlWithoutEntries() throws Exception {
		// arrange
		String expected = "<div class='readHeader'><ul></ul></div><hr><div class='readBoby'><p><br><br></p></div>";
		DayReading.Builder dayReadingBuilder = new DayReading.Builder();
		
		// act
		String actual = dayReadingBuilder.build().toHtml();
		
		// assert
		assertEquals(expected, actual);
	}
	
	@Test
	public void toHtmlWithHeaders() throws Exception {
		// arrange
		String expected = 
				"<div class='readHeader'>"
					+ "<ul>"
					+ "<li><span></span><h1>Header</h1></li>"
					+ "<li><span></span><h2>Header 2</h2></li>"
					+ "<li><span></span><h3>Header 3</h3></li>"
					+ "</ul>"
				+ "</div><hr>"
				+ "<div class='readBoby'><p><br><br></p></div>";
		DayReading.Builder dayReadingBuilder = new DayReading.Builder();
		dayReadingBuilder.addHeaderLevelOne("header");
		dayReadingBuilder.addHeaderLevelTwo("header 2");
		dayReadingBuilder.addHeaderLevelThree("header 3");
		
		// act
		String actual = dayReadingBuilder.build().toHtml();
		
		// assert
		assertEquals(expected, actual);
	}
	
	@Test
	public void toHtmlWithHeadersAndParagraph() throws Exception {
		// arrange
		String expected = 
				"<div class='readHeader'>"
					+ "<ul>"
					+ "<li><span></span><h1>Header</h1></li>"
					+ "</ul>"
				+ "</div><hr>"
				+ "<div class='readBoby'>"
				+ 	"<p class='paragraph'></p>"
				+ "<p><br><br></p></div>";
		DayReading.Builder dayReadingBuilder = new DayReading.Builder();
		dayReadingBuilder.addHeaderLevelOne("header");
		Paragraph paragraph = Paragraph.create();
		dayReadingBuilder.addParagraph(paragraph);
		
		// act
		String actual = dayReadingBuilder.build().toHtml();
		
		// assert
		assertEquals(expected, actual);
	}
	
	@Test
	public void toHtmlWithHeadersAndParagraphsAndLines() throws Exception {
		// arrange
		String expected = 
				"<div class='readHeader'>"
					+ "<ul>"
					+ "<li><span></span><h1>Header</h1></li>"
					+ "</ul>"
				+ "</div><hr>"
				+ "<div class='readBoby'>"
				+ "<p class='paragraph'>"
					+ "<p>paragraph line</p>"
				+ "</p>"
				+ "<p>line</p>"
				+ "<p>line two</p>"
				+ "<p class='paragraph'>"
					+ "<p>paragraph line 2</p>"
				+ "</p>"
				+ "<p><br><br></p></div>";
		DayReading.Builder dayReadingBuilder = new DayReading.Builder();
		dayReadingBuilder.addHeaderLevelOne("header");	
		
		Paragraph paragraph = Paragraph.create();
		paragraph.addLine("paragraph line");
		dayReadingBuilder.addParagraph(paragraph);
		
		dayReadingBuilder.addLine("line");
		dayReadingBuilder.addLine("line two");
		
		Paragraph paragraph2 = Paragraph.create();
		paragraph2.addLine("paragraph line 2");
		dayReadingBuilder.addParagraph(paragraph2);
		
		// act
		String actual = dayReadingBuilder.build().toHtml();
		
		// assert
		assertEquals(expected, actual);
	}
}
