$('#table').bootstrapTable({
	columns: [{
		field: 'name',
		title: '模板名称'
	}, {
		field: 'export',
		title: '导出',
		width: 70,
		formatter: function(value, row, index) {
			return '<button type="button" class="btn btn-info">导出</button>';
		}
	}, {
		field: 'modify',
		title: '编辑',
		width: 70,
		formatter: function(value, row, index) {
			return '<button type="button" class="btn btn-success">编辑</button>';
		}
	}, {
		field: 'delete',
		title: '删除',
		width: 70,
		formatter: function(value, row, index) {
			return '<button type="button" class="btn btn-danger">删除</button>';
		}
	}],
	data: [{
		pageid: 1,
		name: '场馆类活动报名页面'
	}, {
		pageid: 2,
		name: '户外类活动报名页面'
	}],
	onClickCell: function(field, value, row, $element) {
		if (field == 'export') {
			$.ajax('/exportexcel', {
				type: 'get',
				data: {
					pageid: row.pageid
				},
				headers: {
					'Content-Type': 'application/json'
				},
				success: function(data) {
					if (data.result == 0) {
						window.open(data.url);
					} else {
						alert('文件获取失败');
					}
				},
				error: function() {
					alert('文件获取失败');
				}
			});
		}
	}
});