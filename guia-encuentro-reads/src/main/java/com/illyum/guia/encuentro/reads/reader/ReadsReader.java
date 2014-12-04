package com.illyum.guia.encuentro.reads.reader;

import java.util.List;

import com.illyum.guia.encuentro.reads.exceptions.ReadsNotFounException;
import com.illyum.guia.encuentro.reads.lines.AbstractLine;

public interface ReadsReader {
	public List<AbstractLine> readLines(
			String filePath) throws ReadsNotFounException;
}
