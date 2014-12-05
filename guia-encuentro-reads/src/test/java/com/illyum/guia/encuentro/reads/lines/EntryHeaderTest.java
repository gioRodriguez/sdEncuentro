package com.illyum.guia.encuentro.reads.lines;

import static org.junit.Assert.*;

import org.junit.Test;

public class EntryHeaderTest {

	@Test
	public void toHtml() throws Exception {
		// arrange
		String expected = "<li><span></span><h1>Header</h1></li>";		
		
		// act
		String actual = EntryHeader.createWithLevel("header", 1).toHtml();
		
		// assert
		assertEquals(expected, actual);
	}
	
	@Test
	public void toHtmlWithLevelTwo() throws Exception {
		// arrange
		String expected = "<li><span></span><h2>Header</h2></li>";		
		
		// act
		String actual = EntryHeader.createWithLevel("header", 2).toHtml();
		
		// assert
		assertEquals(expected, actual);
	}
	
	@Test
	public void toHtmlWithLevelThree() throws Exception {
		// arrange
		String expected = "<li><span></span><h3>Header</h3></li>";		
		
		// act
		String actual = EntryHeader.createWithLevel("header", 3).toHtml();
		
		// assert
		assertEquals(expected, actual);
	}
}
