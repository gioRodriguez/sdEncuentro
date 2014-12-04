package com.illyum.guia.encuentro.reads.exceptions;

public class ReadsNotFounException extends Exception {
	private static final long serialVersionUID = 1L;

	public ReadsNotFounException() {
		super();
	}

	public ReadsNotFounException(
			String arg0,
			Throwable arg1) {
		super(arg0, arg1);
	}

	public ReadsNotFounException(
			String arg0) {
		super(arg0);
	}

	public ReadsNotFounException(
			Throwable arg0) {
		super(arg0);
	}

}
