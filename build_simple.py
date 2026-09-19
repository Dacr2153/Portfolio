#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Build script to generate simple.html with proper UTF-8 encoding."""

import os

OUTPUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "simple.html")

html = r'''<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>David Colorado &#8212; Ingeniero de Sistemas en Formaci&#243;n</title>
  <meta name="description" content="Portfolio profesional de David Colorado. Ciberseguridad Junior, automatizaci&#243;n y desarrollo de aplicaciones.">
  <meta name="author" content="David Colorado">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
'''

# Now write proper UTF-8 with real characters
with open(OUTPUT, 'w', encoding='utf-8') as f:
    f.write(html)

print("Head written successfully")
