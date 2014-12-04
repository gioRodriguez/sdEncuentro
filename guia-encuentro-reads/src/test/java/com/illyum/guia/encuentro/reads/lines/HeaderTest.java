package com.illyum.guia.encuentro.reads.lines;

import static org.junit.Assert.*;

import org.junit.Test;

public class HeaderTest {

	@Test
	public void toHtmlWithEmpty() throws Exception {
		// arrange
		String expected = "<div class='readHeader'><ul></ul></div><hr>";
		
		// act
		String actual = Header.create().toHtml();
		
		// assert
		assertEquals(expected, actual);
	}
	
	@Test
	public void toHtmlWithEntries() throws Exception {
		// arrange
		String expected = "<div class='readHeader'><ul><li><span></span><h1>Header</h1></li><li><span></span><h2>Header</h2></li></ul></div><hr>";
		Header header = Header.create();
		header.addEntry(EntryHeader.createLevelOneWithContent("header"));
		header.addEntry(EntryHeader.createLevelTwoWithContent("header"));
		
		// act
		String actual = header.toHtml();
		
		// assert
		assertEquals(expected, actual);
	}
}
