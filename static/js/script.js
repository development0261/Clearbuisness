$(document).ready(function() {
  const urlParams = new URLSearchParams(window.location.search);
  const filter = urlParams.get('filter');
  const sources = urlParams.get('sources');
  const offset = urlParams.get('offset');
  const limit = urlParams.get('limit');
  console.log(filter);
  if (sources) {
    $('#sources').val(sources);
    $(".custom-select").each(function () {
      var customSelect = $(this);
      
      var test = $('#sources option:selected').html()
      customSelect.find(".custom-select-trigger").text(test);

    });
  }
  if (offset) {
    $('#offset').val(offset);
  }
  if (limit) {
    $('#limit').val(limit);
  }
  if (filter) {
      $('#search-input').val(filter);
      performSearch()
  }

  
  $('.main_div').on("scroll", function(e) {
    div = $(this);
    if (Math.round(div[0].scrollHeight - div.scrollTop()) == Math.round(div.height()))
    {
      $('#offset').val(parseInt($('#offset').val()) + 100)
      performSearch();
    }
  })
});

$('#search-input').keyup(function() {
    performSearch();
});

function performSearch(){
    var searchValue = $('#search-input').val();
    var sources = $('#sources').val();
    var limit = $('#limit').val();
    var offset = $('#offset').val();

    $.ajax({
        url: 'get_data',  // replace with your Django URL
        method: 'GET',
        data: {
            'filter': searchValue,
            'sources': sources,
            'offset': offset, 
            'limit': limit,
        },
        dataType: 'json',
        beforeSend: function() {
            // Before sending the request, update the URL with the current parameters
            updateURLWithSearchParams({ 'filter': searchValue, 'sources': sources, 'offset': offset,'limit': limit });
          },
        success: function(data){
            // Check if the data contains the key 'status'
            if (data.skus.length == 0) {
                // Clear the table and show "No data" message
                $('#sku-tables').empty().append('<h2 class="no-data">No data</h2>');
            } else {
                $('.cloud-service').empty();
                $.each(data.skus, function (index, sku) {
                    var category = sku.category;
                    var skuData = sku.skus;
                    var skuTable = generateTable(category, skuData);
                  });
            }
        },                    
        error: function(xhr, status, error){
            console.log('Error occurred:', error);
        }
    });
};

function updateURLWithSearchParams(params) {
    const searchParams = new URLSearchParams(params);
    const newURL = `${window.location.pathname}?${searchParams.toString()}`;
    window.history.pushState({ path: newURL }, '', newURL);
  }

function generateTable(category, sku) {
    
    var table = $('<table>').addClass('data-table');
    var tableHead = $('<thead>');
    var tableBody = $('<tbody>');
  
    // Add table headers
    var headerRow = $('<tr>');
    headerRow.append($('<th>').text('SKU'));
    headerRow.append($('<th>').text('Price'));
    headerRow.append($('<th>').text('Regions'));
    tableHead.append(headerRow);
    table.append(tableHead);
  
    $.each(sku, function (index, row) {
      // Create SKU row
      var skuRow = $('<tr>').addClass('sku');
      var skuWrap = $('<div>').addClass('skuwrap');
  
      // Add SKU description and SKU ID
      var nameCell = $('<td>').addClass('name');
      skuWrap.append($('<div>').addClass('description').text(row.description));
      skuWrap.append($('<div>').addClass('sku-id').text(row.sku_id));
      nameCell.append(skuWrap);
      skuRow.append(nameCell);
  
      // Add prices
      var pricesCell = $('<td>').addClass('prices');
      var priceTable = $('<table>');
      $.each(row.prices, function (priceIndex, priceValue) {
        var priceRow = $('<tr>');
        var priceCell = $('<td>').attr('id', 'price').append($('<div>').text(priceValue));
        priceRow.append(priceCell);
        priceTable.append(priceRow);
      });
      pricesCell.append(priceTable);
      skuRow.append(pricesCell);
  
      // Add regions
      var regionsCell = $('<td>').addClass('regions');
      var regionChips = $('<div>').addClass('chips');
      $.each(row.service_regions, function (regionIndex, regionValue) {
        var chip = $('<div>').addClass('chip').attr('region', regionValue).text(regionValue);
        regionChips.append(chip);
      });
      regionsCell.append(regionChips);
      skuRow.append(regionsCell);
  
      tableBody.append(skuRow);
    });
  
    table.append(tableBody);
  
    // Add category and cloud service ID to the table
    var headingContainer = $('<div>').addClass('heading');
    var categoryDiv = $('<div>').addClass('category').text(category);
    var cloudServiceIDDiv = $('<div>').addClass('cloud-service-id').text(sku[0].cloud_service_id);
    headingContainer.append(categoryDiv);
    headingContainer.append(cloudServiceIDDiv);
    $('.cloud-service').append(headingContainer);
    $('.cloud-service').append(table);
  }

function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

$(".custom-select").each(function() {
    var classes = $(this).attr("class"),
        id      = $(this).attr("id"),
        name    = $(this).attr("name");
    var template =  '<div class="' + classes + '">';
        template += '<span class="custom-select-trigger">' + $(this).attr("placeholder") + '</span>';
        template += '<div class="custom-options">';
        $(this).find("option").each(function() {
          template += '<span class="custom-option ' + $(this).attr("class") + '" data-value="' + $(this).attr("value") + '">' + $(this).html() + '</span>';
        });
    template += '</div></div>';
    
    $(this).wrap('<div class="custom-select-wrapper"></div>');
    $(this).hide();
    $(this).after(template);
  });
  $(".custom-option:first-of-type").hover(function() {
    $(this).parents(".custom-options").addClass("option-hover");
  }, function() {
    $(this).parents(".custom-options").removeClass("option-hover");
  });
  $(".custom-select-trigger").on("click", function() {
    $('html').one('click',function() {
      $(".custom-select").removeClass("opened");
    });
    $(this).parents(".custom-select").toggleClass("opened");
    event.stopPropagation();
  });
  $(".custom-option").on("click", function() {
    $(this).parents(".custom-select-wrapper").find("select").val($(this).data("value"));
    $(this).parents(".custom-options").find(".custom-option").removeClass("selection");
    $(this).addClass("selection");
    performSearch($(this).val());
    $(this).parents(".custom-select").removeClass("opened");
    $(this).parents(".custom-select").find(".custom-select-trigger").text($(this).text());
  });
  

$("#copy").click(function() {
    // Get the current URL
    var currentUrl = window.location.href;

    // Create a temporary input element to copy the URL to the clipboard
    var tempInput = $("<input>");
    $("body").append(tempInput);
    tempInput.val(currentUrl).select();
    document.execCommand("copy");
    tempInput.remove();
});