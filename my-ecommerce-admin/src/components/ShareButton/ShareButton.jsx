import React from 'react';
import PropTypes from 'prop-types';
import { FaShareAlt } from 'react-icons/fa';

const ShareButton = ({ product }) => {
  const copyProductLink = () => {
    if (!product?.id) {
      alert('Product not available for sharing');
      return;
    }

    const url = `${window.location.origin}/productdisplay/${product.id}`;
    navigator.clipboard.writeText(url)
      .then(() => alert('Product link copied to clipboard!'))
      .catch(() => alert('Failed to copy link. Please try again.'));
  };

  return (
    <div className="share-buttons">
      <button 
        onClick={copyProductLink} 
        className="copy-link"
        disabled={!product?.id}
        aria-label="Copy product link to clipboard"
      >
        <FaShareAlt /> Copy Product Link
      </button>
    </div>
  );
};

ShareButton.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
  }).isRequired
};

export default ShareButton;