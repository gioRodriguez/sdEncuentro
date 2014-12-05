package com.illyum.guia.encuentro.reads.read;

import com.illyum.guia.encuentro.reads.exceptions.ReadsNotFounException;
import com.illyum.guia.encuentro.reads.formatters.HtmlFormatter;
import com.illyum.guia.encuentro.reads.lines.DailyReading;
import com.illyum.guia.encuentro.reads.reader.ReadsReader;

public class ReadsRepository implements HtmlFormatter{
	private final ReadsReader _guiaEncuentroReader;
	private String _readPath;
	
	public ReadsRepository(
			ReadsReader guiaEncuentroReader
	) {
		_guiaEncuentroReader = guiaEncuentroReader;
		_readPath = "";
	}

	@Override
	public String toHtml() {
		DailyReading dailyReading = DailyReading.empty();
		try {
			dailyReading = _guiaEncuentroReader.readLines(_readPath);
		} catch (ReadsNotFounException e) {
			e.printStackTrace();
		}
		return dailyReading.toHtml();
	}

	public void setReadPath(String readPath) {
		_readPath = readPath;
	}

}
