"""Este módulo configura um logger padronizado para a aplicação."""

import logging
import sys


def get_logger(name: str) -> logging.Logger:
    """
    Cria e configura um logger com um formato padrão.

    Args:
        name (str): O nome do logger, geralmente __name__.

    Returns:
        logging.Logger: A instância do logger configurado.
    """
    logger = logging.getLogger(name)
    if not logger.handlers:
        logger.setLevel(logging.INFO)
        handler = logging.StreamHandler(sys.stdout)
        formatter = logging.Formatter(
            "%(asctime)s - %(name)s - %(levelname)s - %(message)s",
            datefmt="%Y-%m-%d %H:%M:%S",
        )
        handler.setFormatter(formatter)
        logger.addHandler(handler)
    return logger
