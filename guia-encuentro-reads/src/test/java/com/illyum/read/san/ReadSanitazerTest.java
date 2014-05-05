package com.illyum.read.san;

import static org.junit.Assert.assertEquals;

import java.io.File;
import java.io.IOException;
import java.net.URISyntaxException;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;

import org.junit.Ignore;
import org.junit.Test;

public class ReadSanitazerTest {

	@Ignore
	@Test
	public void removeEmptyLinesTest() throws IOException, URISyntaxException {
		// arrange
		String expected = ReadSanitazer
				.loadFile("withoutEmptyLinesExpected.rel");

		// act
		ReadSanitazer.removeEmptyLines("withoutEmptyLines.txt");
		String actual = ReadSanitazer.loadFile("withoutEmptyLines.rel");

		// assert
		assertEquals(expected, actual);
	}

	@Ignore
	@Test
	public void buildHeaderTest() throws IOException, URISyntaxException {
		// arrange
		String expected = ReadSanitazer.loadFile("buildHeaderExpected.bh");

		// act
		ReadSanitazer.buildHeader("withoutEmptyLines.rel");
		String actual = ReadSanitazer.loadFile("withoutEmptyLines.bh");

		// assert
		assertEquals(expected, actual);
	}

	@Test
	public void buildAllTest() throws IOException, URISyntaxException {
		List<String> results = new ArrayList<String>();

		URL folder = ReadSanitazerTest.class.getClassLoader().getResource(
				"texts");
		File[] months = new File(folder.getPath()).listFiles();

		for (File month : months) {
			File[] reads = month.listFiles();
			for (File read : reads) {
				if (read.isFile()) {
					results.add(read.getPath());
				}
			}
		}

		for (String file : results) {
			System.out.println(file);
			ReadSanitazer.buildAll(file);
		}
	}

}
