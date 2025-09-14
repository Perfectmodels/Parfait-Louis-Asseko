
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useData } from '../contexts/DataContext';
import { Model, BeginnerStudent } from '../types';
import SEO from '../components/SEO';
// FIX: Corrected react-router-dom import statement to resolve module resolution errors.
import * as ReactRouterDOM from 'react-router-dom';
import { ChevronLeftIcon, TrashIcon, PencilIcon, PlusIcon, ArrowUpIcon, ArrowDownIcon, EyeIcon, EyeSlashIcon, XMarkIcon, PrinterIcon, EnvelopeIcon, PhoneIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import Model