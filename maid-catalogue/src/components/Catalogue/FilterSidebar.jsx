import React, { useState, useCallback, useMemo, memo } from 'react';
import { useMediaQuery } from '@mui/material';
import { 
  AttachMoney as MoneyIcon,
  Person as PersonIcon,
  Public as PublicIcon,
  Star as StarIcon,
  Translate as TranslateIcon,
  Work as WorkIcon,
  Clear as ClearIcon,
  ExpandLess as ChevronUpIcon,
  ExpandMore as ChevronDownIcon
} from '@mui/icons-material';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { Checkbox } from "../ui/checkbox";
import { Slider } from "../ui/slider";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";

// Orange brand color constants
const ORANGE_COLORS = {
  primary: '#ff914d',
  light: '#ffa366', 
  dark: '#e67e22',
  background: '#fafafa',
  surface: '#ffffff',
  text: '#0c191b',
  textSecondary: '#5a6c6f',
  border: '#e0e0e0'
};

// Filter options
const skillsetOptions = ['Cooking', 'Housekeeping', 'Childcare', 'Babysitting', 'Elderly Care', 'Dog(s)', 'Cat(s)', 'Caregiving'];
const languageOptions = ['English', 'Mandarin', 'Dialect'];
const typeOptions = ['New/Fresh', 'Transfer', 'Ex-Singapore', 'Ex-Hongkong', 'Ex-Taiwan', 'Ex-Middle East'];
const countryOptions = ['Philippines', 'Indonesia', 'Myanmar'];

// Orange-themed Range Slider Component
const OrangeRangeSlider = memo(({ 
  min = 0, 
  max = 100, 
  step = 1, 
  value = [min, max], 
  onValueChange,
  formatLabel = v => v,
  disabled = false 
}) => {
  return (
    <div className="w-full px-2 py-4">
      {/* Value Display */}
      <div className="flex justify-between mb-4">
        <span className="text-sm font-semibold text-orange-600">
          {formatLabel(value[0])}
        </span>
        <span className="text-sm font-semibold text-orange-600">
          {formatLabel(value[1])}
        </span>
      </div>
      
      {/* Orange-themed Slider */}
      <Slider
        value={value}
        onValueChange={onValueChange}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        className="w-full [&>span:first-child]:h-2 [&>span:first-child]:bg-orange-200 [&_[role=slider]]:h-5 [&_[role=slider]]:w-5 [&_[role=slider]]:border-2 [&_[role=slider]]:border-orange-500 [&_[role=slider]]:bg-orange-500 [&>span:first-child>span]:bg-orange-500 [&_[role=slider]:focus-visible]:ring-orange-400"
      />
    </div>
  );
});

// Filter Section Component with Orange Accordion
const FilterSection = memo(({ title, icon, children, value }) => (
  <AccordionItem value={value} className="border-orange-100">
    <AccordionTrigger className="hover:bg-orange-50 data-[state=open]:bg-orange-50 px-4 py-3 rounded-t-lg">
      <div className="flex items-center gap-3">
        <div className="text-orange-500 flex items-center">
          {icon}
        </div>
        <span className="font-semibold text-orange-900">{title}</span>
      </div>
    </AccordionTrigger>
    <AccordionContent className="px-4 pb-4 pt-2 bg-white rounded-b-lg">
      {children}
    </AccordionContent>
  </AccordionItem>
));

// Orange-themed Checkbox Filter
const CheckboxFilter = memo(({ options, selected, onToggle, columns = 2 }) => (
  <div className={`grid grid-cols-${columns} gap-3 sm:gap-4`}>
    {options.map((option) => (
      <div key={option} className="flex items-center space-x-2 sm:space-x-3">
        <Checkbox 
          id={option}
          checked={selected.includes(option)}
          onCheckedChange={() => onToggle(option)}
          className="border-orange-300 data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500 w-4 h-4 sm:w-5 sm:h-5"
        />
        <label 
          htmlFor={option} 
          className="text-sm sm:text-base font-medium text-orange-900 cursor-pointer leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {option}
        </label>
      </div>
    ))}
  </div>
));

// Orange-themed Chip Filter (using buttons)
const ChipFilter = memo(({ options, selected, onToggle }) => (
  <div className="flex flex-wrap gap-2 sm:gap-3">
    {options.map((option) => {
      const isSelected = selected.includes(option);
      return (
        <Button
          key={option}
          variant="outline"
          size="sm"
          onClick={() => onToggle(option)}
          className={`
            h-8 sm:h-9 lg:h-10 px-3 sm:px-4 text-xs sm:text-sm font-medium transition-all duration-200 border-2 touch-manipulation
            ${isSelected 
              ? 'bg-orange-500 hover:bg-orange-600 text-white border-orange-500' 
              : 'bg-white border-orange-300 text-orange-700 hover:bg-orange-50 hover:border-orange-400'
            }
          `}
        >
          {option}
        </Button>
      );
    })}
  </div>
));

const FilterSidebar = memo(function FilterSidebar({
  defaultSalaryRange, onSalaryChange,
  defaultAgeRange, onAgeChange,
  selectedCountries, setSelectedCountries,
  skillsets, setSkillsets,
  languages, setLanguages,
  types, setTypes
}) {
  const isSameColumn = useMediaQuery('(max-width: 1023px)');
  
  // Collapse state - only used for screens 1023px and below
  const [isCollapsed, setIsCollapsed] = useState(true);
  
  // Toggle handlers
  const handleToggle = useCallback((setter, value) => {
    setter((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  }, []);

  const clearAll = () => {
    onSalaryChange([400, 1000]);
    onAgeChange([18, 60]);
    setSelectedCountries([]);
    setSkillsets([]);
    setLanguages([]);
    setTypes([]);
  };

  // Calculate active filters count
  const activeCount = useMemo(() => {
    let count = 0;
    if (defaultSalaryRange[0] > 400 || defaultSalaryRange[1] < 1000) count++;
    if (defaultAgeRange[0] > 18 || defaultAgeRange[1] < 60) count++;
    count += selectedCountries.length + skillsets.length + languages.length + types.length;
    return count;
  }, [defaultSalaryRange, defaultAgeRange, selectedCountries, skillsets, languages, types]);

  // Header content - clickable for screens 1023px and below to toggle collapse
  const headerContent = (
    <div 
      className={`flex justify-between items-center p-4 bg-gradient-to-r from-orange-500 to-orange-400 ${
        isSameColumn ? 'cursor-pointer hover:from-orange-600 hover:to-orange-500 transition-all duration-200' : ''
      }`}
      onClick={isSameColumn ? () => setIsCollapsed(!isCollapsed) : undefined}
    >
      <div className="flex items-center gap-2">
        <h3 className="text-lg font-bold text-white">Filters</h3>
        {isSameColumn && (
          <div className="text-white">
            {isCollapsed ? (
              <ChevronDownIcon className="w-5 h-5" />
            ) : (
              <ChevronUpIcon className="w-5 h-5" />
            )}
          </div>
        )}
      </div>
      {activeCount > 0 && (
        <Button 
          variant="secondary"
          size="sm"
          onClick={(e) => {
            e.stopPropagation(); // Prevent header click when clicking clear button
            clearAll();
          }}
          className="bg-white/20 hover:bg-white/30 text-white border-white/30"
        >
          <ClearIcon className="w-4 h-4 mr-2" />
          Clear All ({activeCount})
        </Button>
      )}
    </div>
  );

  // Filter accordion content
  const filterContent = (
    <>
      {/* Filter Accordion */}
      <Accordion type="multiple" defaultValue={["salary", "age", "countries", "skillsets", "languages", "experience"]} className="space-y-3">
        {/* Salary Range */}
        <FilterSection 
          title="Salary Range" 
          icon={<MoneyIcon />} 
          value="salary"
        >
          <OrangeRangeSlider
            min={400}
            max={1000}
            step={25}
            value={defaultSalaryRange}
            onValueChange={onSalaryChange}
            formatLabel={v => `$${v}`}
          />
        </FilterSection>

        {/* Age Range */}
        <FilterSection 
          title="Age Range" 
          icon={<PersonIcon />} 
          value="age"
        >
          <OrangeRangeSlider
            min={18}
            max={60}
            step={1}
            value={defaultAgeRange}
            onValueChange={onAgeChange}
            formatLabel={v => `${v} yrs`}
          />
        </FilterSection>

        <Separator className="bg-orange-100" />

        {/* Countries */}
        <FilterSection 
          title="Countries" 
          icon={<PublicIcon />} 
          value="countries"
        >
          <CheckboxFilter
            options={countryOptions}
            selected={selectedCountries}
            onToggle={(value) => handleToggle(setSelectedCountries, value)}
            columns={isSameColumn ? 1 : 2}
          />
        </FilterSection>

        {/* Skillsets */}
        <FilterSection 
          title="Skillsets" 
          icon={<StarIcon />} 
          value="skillsets"
        >
          <ChipFilter
            options={skillsetOptions}
            selected={skillsets}
            onToggle={(value) => handleToggle(setSkillsets, value)}
          />
        </FilterSection>

        {/* Languages */}
        <FilterSection 
          title="Languages" 
          icon={<TranslateIcon />} 
          value="languages"
        >
          <CheckboxFilter
            options={languageOptions}
            selected={languages}
            onToggle={(value) => handleToggle(setLanguages, value)}
            columns={isSameColumn ? 1 : 2}
          />
        </FilterSection>

        {/* Experience Type */}
        <FilterSection 
          title="Experience Type" 
          icon={<WorkIcon />} 
          value="experience"
        >
          <ChipFilter
            options={typeOptions}
            selected={types}
            onToggle={(value) => handleToggle(setTypes, value)}
          />
        </FilterSection>
      </Accordion>
    </>
  );

  // Show filter sidebar - collapsible for screens 1023px and below
  return (
    <div className={`z-40 self-start rounded-lg border border-orange-300 shadow-lg ${
      isSameColumn ? 'overflow-visible' : 'max-h-[calc(100vh-160px)] overflow-hidden'
    }`}>
      {/* Full-width header */}
      {headerContent}
      
      {/* Content container - maintains layout space when collapsed on screens 1023px and below */}
      <div className={`bg-white overflow-hidden transition-all duration-300 ${
        isSameColumn && isCollapsed 
          ? 'max-h-0 p-0' 
          : isSameColumn
          ? 'overflow-visible p-4'
          : 'max-h-[calc(100vh-220px)] overflow-y-auto p-4'
      }`}>
        {filterContent}
      </div>
    </div>
  );
});

export default FilterSidebar;