import React from 'react';
import useState from 'react';
import './Options.css';

interface Props {
  title: string;
  apiKey: string;
}

const Options: React.FC<Props> = ({ title, apiKey }: Props) => {
  return (
    <div className="OptionsContainer">
      {title} Page
      <div>{apiKey} test</div>
    </div>
  );
};

export default Options;
