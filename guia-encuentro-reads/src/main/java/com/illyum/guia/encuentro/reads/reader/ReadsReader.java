package com.illyum.guia.encuentro.reads.reader;

import java.util.List;

import com.illyum.guia.encuentro.reads.exceptions.ReadsNotFounException;
import com.illyum.guia.encuentro.reads.lines.Line;

public interface ReadsReader {
	public List<Line> readLines(
			String filePath) throws ReadsNotFounException;
}
