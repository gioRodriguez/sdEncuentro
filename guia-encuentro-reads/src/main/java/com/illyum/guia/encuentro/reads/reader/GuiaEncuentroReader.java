package com.illyum.guia.encuentro.reads.reader;

import java.util.List;

import com.illyum.guia.encuentro.reads.exceptions.GuiaEncuenctroReadsNotFounException;
import com.illyum.guia.encuentro.reads.lines.GuiaEncuentroLine;

public interface GuiaEncuentroReader {
	public List<GuiaEncuentroLine> readLines(
			String filePath) throws GuiaEncuenctroReadsNotFounException;
}
