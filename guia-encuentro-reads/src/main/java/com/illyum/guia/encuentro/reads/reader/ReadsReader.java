package com.illyum.guia.encuentro.reads.reader;

import com.illyum.guia.encuentro.reads.exceptions.ReadsNotFounException;
import com.illyum.guia.encuentro.reads.lines.DailyReading;

public interface ReadsReader {
	public DailyReading readLines(
			String filePath
	)
		throws ReadsNotFounException;
}
